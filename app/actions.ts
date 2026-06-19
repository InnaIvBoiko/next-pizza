'use server';

import { prisma } from '@/prisma/prisma-client';
import {
    PayOrderTemplate,
    VerificationUserTemplate,
} from '@/shared/components/shared/email-temapltes';
import { CheckoutFormValues, getDeliveryPrice } from '@/shared/constants';
import { createPayment } from '@/shared/lib/create-payment';
import { sendEmail } from '@/shared/lib/send-email';
import { getUserSession } from '@/shared/lib/get-user-session';
import { logger } from '@/shared/lib/logger.server';
import { OrderStatus, Prisma } from '@/generated/prisma/client';
import { hashSync } from 'bcrypt';
import { cookies } from 'next/headers';
import React from 'react';

export async function createOrder(data: CheckoutFormValues) {
    try {
        const cookieStore = await cookies();
        const cartToken = cookieStore.get('cartToken')?.value;

        if (!cartToken) {
            throw new Error('Cart token not found');
        }

        /* Finding the cart by token */
        const userCart = await prisma.cart.findFirst({
            include: {
                user: true,
                items: {
                    include: {
                        ingredients: true,
                        removedIngredients: true,
                        productItem: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
            where: {
                token: cartToken,
            },
        });

        /* If the cart is not found return an error */
        if (!userCart) {
            throw new Error('Cart not found');
        }

        /* If the cart is empty return an error */
        if (userCart?.totalAmount === 0) {
            throw new Error('Cart is empty');
        }

        /* Link the order to the signed-in user (if any) so it shows up in their
           order history. Guest checkouts stay unlinked. */
        const session = await getUserSession();

        /* Creating an order */
        const order = await prisma.order.create({
            data: {
                token: cartToken,
                userId: session ? Number(session.id) : undefined,
                fullName: data.firstName + ' ' + data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                comment: data.comment,
                // Charged total = cart + delivery (matches the checkout sidebar).
                totalAmount: userCart.totalAmount + getDeliveryPrice(userCart.totalAmount),
                status: OrderStatus.PENDING,
                items: JSON.stringify(userCart.items),
            },
        });

        /* Clearing the cart */
        await prisma.cart.update({
            where: {
                id: userCart.id,
            },
            data: {
                totalAmount: 0,
            },
        });

        await prisma.cartItem.deleteMany({
            where: {
                cartId: userCart.id,
            },
        });

        const paymentData = await createPayment({
            orderId: order.id,
            cartAmount: userCart.totalAmount,
            deliveryPrice: getDeliveryPrice(userCart.totalAmount),
        });

        if (!paymentData || !paymentData.url) {
            throw new Error('Payment data not found');
        }

        await prisma.order.update({
            where: {
                id: order.id,
            },
            data: {
                paymentId: paymentData.id,
            },
        });

        const paymentUrl = paymentData.url;

        // Email is non-critical: never let a send failure block the payment redirect.
        try {
            await sendEmail(
                data.email,
                'Next Pizza / Pay for order #' + order.id,
                React.createElement(PayOrderTemplate, {
                    orderId: order.id,
                    totalAmount: order.totalAmount,
                    paymentUrl,
                })
            );
        } catch (emailErr) {
            logger.error(
                { err: emailErr },
                '[CreateOrder] Email send failed (non-blocking)'
            );
        }

        return paymentUrl;
    } catch (err) {
        logger.error({ err }, '[CreateOrder] Server error');
    }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
    try {
        const currentUser = await getUserSession();

        if (!currentUser) {
            throw new Error('User not found');
        }

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(currentUser.id),
            },
        });

        await prisma.user.update({
            where: {
                id: Number(currentUser.id),
            },
            data: {
                fullName: body.fullName,
                email: body.email,
                password: body.password
                    ? hashSync(body.password as string, 10)
                    : findUser?.password,
            },
        });
    } catch (err) {
        logger.error({ err }, 'Error [UPDATE_USER]');
        throw err;
    }
}

/**
 * Resume payment for an order that was created but never paid (status PENDING).
 * Stripe Checkout URLs expire, so a fresh session is created each time. Returns
 * the hosted payment URL for the client to redirect to.
 */
export async function payOrder(orderId: number) {
    try {
        const session = await getUserSession();

        if (!session) {
            throw new Error('Not authenticated');
        }

        const order = await prisma.order.findFirst({
            where: { id: orderId, userId: Number(session.id) },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new Error('Order is not awaiting payment');
        }

        // The stored totalAmount already includes delivery; charge it as a
        // single line on the resumed session.
        const payment = await createPayment({
            orderId: order.id,
            cartAmount: order.totalAmount,
            deliveryPrice: 0,
        });

        if (!payment?.url) {
            throw new Error('Payment data not found');
        }

        await prisma.order.update({
            where: { id: order.id },
            data: { paymentId: payment.id },
        });

        return payment.url;
    } catch (err) {
        logger.error({ err }, '[PayOrder] Server error');
        throw err;
    }
}

/**
 * Cancel an unpaid order (status PENDING). Paid orders can't be self-cancelled
 * here (that would need a refund flow). After this the order moves to history.
 */
export async function cancelOrder(orderId: number) {
    try {
        const session = await getUserSession();

        if (!session) {
            throw new Error('Not authenticated');
        }

        const order = await prisma.order.findFirst({
            where: { id: orderId, userId: Number(session.id) },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new Error('Only unpaid orders can be cancelled');
        }

        await prisma.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.CANCELLED },
        });
    } catch (err) {
        logger.error({ err }, '[CancelOrder] Server error');
        throw err;
    }
}

/**
 * Kitchen/admin: advance an order through the preparation pipeline. Restricted
 * to the kitchen-relevant transitions so staff can't set arbitrary statuses.
 */
export async function advanceKitchenOrder(
    orderId: number,
    status: OrderStatus
) {
    try {
        const session = await getUserSession();

        if (
            !session ||
            (session.role !== 'ADMIN' && session.role !== 'KITCHEN')
        ) {
            throw new Error('Forbidden');
        }

        const allowed: OrderStatus[] = ['PREPARING', 'READY', 'OUT_FOR_DELIVERY'];
        if (!allowed.includes(status)) {
            throw new Error('Invalid kitchen transition');
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    } catch (err) {
        logger.error({ err }, '[AdvanceKitchenOrder] Server error');
        throw err;
    }
}

/**
 * Admin-only: set any order to any status (advances the lifecycle from the
 * dashboard). Guarded by the user's ADMIN role.
 */
export async function updateOrderStatus(orderId: number, status: OrderStatus) {
    try {
        const session = await getUserSession();

        if (!session || session.role !== 'ADMIN') {
            throw new Error('Forbidden');
        }

        if (!Object.values(OrderStatus).includes(status)) {
            throw new Error('Invalid status');
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    } catch (err) {
        logger.error({ err }, '[UpdateOrderStatus] Server error');
        throw err;
    }
}

/** Throws unless the caller is an authenticated admin. */
async function requireAdmin() {
    const session = await getUserSession();
    if (!session || session.role !== 'ADMIN') {
        throw new Error('Forbidden');
    }
}

// A price variant. Plain products have one (size/pizzaType null); pizzas have
// several, one per size × dough combination. `id` is set for existing rows.
interface ProductVariantInput {
    id?: number;
    price: number;
    size: number | null;
    pizzaType: number | null;
}

interface ProductInput {
    name: string;
    nameIt: string;
    description: string;
    descriptionIt: string;
    imageUrl: string;
    categoryId: number;
    includedIds: number[];
    extraIds: number[];
    items: ProductVariantInput[];
}

const cleanVariants = (items: ProductVariantInput[]) =>
    items
        .filter(item => item.price > 0)
        .map(item => ({
            id: item.id,
            price: item.price,
            size: item.size,
            pizzaType: item.pizzaType,
        }));

/**
 * Admin-only: edit a product's catalog data — names (EN/IT), optional
 * descriptions (EN/IT), image, category, included/extra ingredients, and its
 * price variants (size/dough/price). Removed variants and their cart references
 * are cleared so foreign keys don't block.
 */
export async function updateProduct(input: ProductInput & { id: number }) {
    try {
        await requireAdmin();

        const variants = cleanVariants(input.items);
        if (variants.length === 0) throw new Error('At least one variant');

        const existing = await prisma.productItem.findMany({
            where: { productId: input.id },
            select: { id: true },
        });
        const keptIds = variants
            .map(v => v.id)
            .filter((id): id is number => typeof id === 'number');
        const removedIds = existing
            .map(e => e.id)
            .filter(id => !keptIds.includes(id));

        await prisma.$transaction([
            prisma.product.update({
                where: { id: input.id },
                data: {
                    name: input.name.trim(),
                    nameIt: input.nameIt.trim() || null,
                    description: input.description.trim() || null,
                    descriptionIt: input.descriptionIt.trim() || null,
                    imageUrl: input.imageUrl.trim(),
                    categoryId: input.categoryId,
                    ingredients: { set: input.includedIds.map(id => ({ id })) },
                    extraIngredients: {
                        set: input.extraIds.map(id => ({ id })),
                    },
                },
            }),
            // Drop variants the admin removed (and any carts referencing them).
            prisma.cartItem.deleteMany({
                where: { productItemId: { in: removedIds } },
            }),
            prisma.productItem.deleteMany({
                where: { id: { in: removedIds } },
            }),
            // Update kept variants in place.
            ...variants
                .filter(v => typeof v.id === 'number')
                .map(v =>
                    prisma.productItem.update({
                        where: { id: v.id },
                        data: {
                            price: v.price,
                            size: v.size,
                            pizzaType: v.pizzaType,
                        },
                    })
                ),
            // Create newly added variants.
            ...variants
                .filter(v => typeof v.id !== 'number')
                .map(v =>
                    prisma.productItem.create({
                        data: {
                            productId: input.id,
                            price: v.price,
                            size: v.size,
                            pizzaType: v.pizzaType,
                        },
                    })
                ),
        ]);
    } catch (err) {
        logger.error({ err }, '[UpdateProduct] Server error');
        throw err;
    }
}

/** Admin-only: create a product with one or more price variants. */
export async function createProduct(input: ProductInput) {
    try {
        await requireAdmin();

        const variants = cleanVariants(input.items);
        if (variants.length === 0) throw new Error('At least one variant');

        await prisma.product.create({
            data: {
                name: input.name.trim(),
                nameIt: input.nameIt.trim() || null,
                description: input.description.trim() || null,
                descriptionIt: input.descriptionIt.trim() || null,
                imageUrl: input.imageUrl.trim(),
                categoryId: input.categoryId,
                ingredients: { connect: input.includedIds.map(id => ({ id })) },
                extraIngredients: {
                    connect: input.extraIds.map(id => ({ id })),
                },
                items: {
                    create: variants.map(v => ({
                        price: v.price,
                        size: v.size,
                        pizzaType: v.pizzaType,
                    })),
                },
            },
        });
    } catch (err) {
        logger.error({ err }, '[CreateProduct] Server error');
        throw err;
    }
}

/**
 * Admin-only: delete a product. Clears its cart-item references and price
 * variants first so foreign keys don't block; the shopping-list link cascades.
 */
export async function deleteProduct(id: number) {
    try {
        await requireAdmin();

        await prisma.$transaction([
            prisma.cartItem.deleteMany({
                where: { productItem: { productId: id } },
            }),
            prisma.productItem.deleteMany({ where: { productId: id } }),
            prisma.product.delete({ where: { id } }),
        ]);
    } catch (err) {
        logger.error({ err }, '[DeleteProduct] Server error');
        throw err;
    }
}

/** Admin-only: create a category (name EN required, nameIt optional). */
export async function createCategory(name: string, nameIt: string) {
    try {
        await requireAdmin();

        const trimmed = name.trim();
        if (!trimmed) throw new Error('Name required');

        await prisma.category.create({
            data: { name: trimmed, nameIt: nameIt.trim() || null },
        });
    } catch (err) {
        logger.error({ err }, '[CreateCategory] Server error');
        throw err;
    }
}

/** Admin-only: rename a category (EN/IT). */
export async function updateCategory(id: number, name: string, nameIt: string) {
    try {
        await requireAdmin();

        const trimmed = name.trim();
        if (!trimmed) throw new Error('Name required');

        await prisma.category.update({
            where: { id },
            data: { name: trimmed, nameIt: nameIt.trim() || null },
        });
    } catch (err) {
        logger.error({ err }, '[UpdateCategory] Server error');
        throw err;
    }
}

/** Admin-only: delete a category. Fails if it still has products. */
export async function deleteCategory(id: number) {
    try {
        await requireAdmin();

        const count = await prisma.product.count({
            where: { categoryId: id },
        });
        if (count > 0) throw new Error('Category not empty');

        await prisma.category.delete({ where: { id } });
    } catch (err) {
        logger.error({ err }, '[DeleteCategory] Server error');
        throw err;
    }
}

interface IngredientInput {
    name: string;
    nameIt: string;
    price: number;
    imageUrl: string;
}

/** Admin-only: create an ingredient (available by default). */
export async function createIngredient(input: IngredientInput) {
    try {
        await requireAdmin();

        const name = input.name.trim();
        if (!name) throw new Error('Name required');

        await prisma.ingredient.create({
            data: {
                name,
                nameIt: input.nameIt.trim() || null,
                price: input.price,
                imageUrl: input.imageUrl.trim(),
            },
        });
    } catch (err) {
        logger.error({ err }, '[CreateIngredient] Server error');
        throw err;
    }
}

/** Admin-only: edit an ingredient's catalog data (name EN/IT, price, image). */
export async function updateIngredient(input: IngredientInput & { id: number }) {
    try {
        await requireAdmin();

        const name = input.name.trim();
        if (!name) throw new Error('Name required');

        await prisma.ingredient.update({
            where: { id: input.id },
            data: {
                name,
                nameIt: input.nameIt.trim() || null,
                price: input.price,
                imageUrl: input.imageUrl.trim(),
            },
        });
    } catch (err) {
        logger.error({ err }, '[UpdateIngredient] Server error');
        throw err;
    }
}

/**
 * Admin-only: delete an ingredient. Its links to products/carts (implicit
 * many-to-many) and its shopping-list entry cascade away automatically.
 */
export async function deleteIngredient(id: number) {
    try {
        await requireAdmin();

        await prisma.ingredient.delete({ where: { id } });
    } catch (err) {
        logger.error({ err }, '[DeleteIngredient] Server error');
        throw err;
    }
}

/**
 * Staff (admin/kitchen): toggle an ingredient's availability. Going out of stock
 * auto-adds it to the shopping list; restocking removes it from the list.
 */
export async function setIngredientAvailability(
    ingredientId: number,
    available: boolean
) {
    try {
        const session = await getUserSession();
        if (
            !session ||
            (session.role !== 'ADMIN' && session.role !== 'KITCHEN')
        ) {
            throw new Error('Forbidden');
        }

        const ingredient = await prisma.ingredient.update({
            where: { id: ingredientId },
            data: { available },
        });

        if (available) {
            await prisma.shoppingItem.deleteMany({ where: { ingredientId } });
        } else {
            await prisma.shoppingItem.upsert({
                where: { ingredientId },
                update: {},
                create: {
                    ingredientId,
                    label: ingredient.nameIt ?? ingredient.name,
                },
            });
        }
    } catch (err) {
        logger.error({ err }, '[SetIngredientAvailability] Server error');
        throw err;
    }
}

/**
 * Staff (admin/kitchen): toggle a product's manual out-of-stock override. Going
 * out of stock hides it from the menu and adds an "Ingredienti per …" line to
 * the shopping list; restocking removes that line.
 */
export async function setProductAvailability(
    productId: number,
    available: boolean
) {
    try {
        const session = await getUserSession();
        if (
            !session ||
            (session.role !== 'ADMIN' && session.role !== 'KITCHEN')
        ) {
            throw new Error('Forbidden');
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: { available },
        });

        if (available) {
            await prisma.shoppingItem.deleteMany({ where: { productId } });
        } else {
            await prisma.shoppingItem.upsert({
                where: { productId },
                update: {},
                create: {
                    productId,
                    label: `Ingredienti per ${product.name}`,
                },
            });
        }
    } catch (err) {
        logger.error({ err }, '[SetProductAvailability] Server error');
        throw err;
    }
}

/** Staff: add a free-text item to the shopping list. */
export async function addShoppingItem(label: string) {
    try {
        const session = await getUserSession();
        if (
            !session ||
            (session.role !== 'ADMIN' && session.role !== 'KITCHEN')
        ) {
            throw new Error('Forbidden');
        }

        const trimmed = label.trim();
        if (!trimmed) return;

        await prisma.shoppingItem.create({ data: { label: trimmed } });
    } catch (err) {
        logger.error({ err }, '[AddShoppingItem] Server error');
        throw err;
    }
}

/**
 * Staff: remove (mark bought) a shopping list item. If the item is linked to an
 * ingredient or product, restock it (set available = true) so it reappears as
 * available.
 */
export async function removeShoppingItem(id: number) {
    try {
        const session = await getUserSession();
        if (
            !session ||
            (session.role !== 'ADMIN' && session.role !== 'KITCHEN')
        ) {
            throw new Error('Forbidden');
        }

        const item = await prisma.shoppingItem.delete({ where: { id } });

        if (item.ingredientId) {
            await prisma.ingredient.update({
                where: { id: item.ingredientId },
                data: { available: true },
            });
        }

        if (item.productId) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { available: true },
            });
        }
    } catch (err) {
        logger.error({ err }, '[RemoveShoppingItem] Server error');
        throw err;
    }
}

/** Staff: edit the label of a shopping list item. */
export async function updateShoppingItem(id: number, label: string) {
    try {
        const session = await getUserSession();
        if (
            !session ||
            (session.role !== 'ADMIN' && session.role !== 'KITCHEN')
        ) {
            throw new Error('Forbidden');
        }

        const trimmed = label.trim();
        if (!trimmed) return;

        await prisma.shoppingItem.update({
            where: { id },
            data: { label: trimmed },
        });
    } catch (err) {
        logger.error({ err }, '[UpdateShoppingItem] Server error');
        throw err;
    }
}

export async function deleteUser() {
    try {
        const currentUser = await getUserSession();

        if (!currentUser) {
            throw new Error('User not found');
        }

        // Cascades remove the user's cart and verification code; orders keep
        // their records with the user reference set to null (see schema).
        await prisma.user.delete({
            where: {
                id: Number(currentUser.id),
            },
        });
    } catch (err) {
        logger.error({ err }, 'Error [DELETE_USER]');
        throw err;
    }
}

export async function registerUser(body: Prisma.UserCreateInput) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
            },
        });

        if (user) {
            if (!user.verified) {
                throw new Error('User not verified');
            }

            throw new Error('User already exists');
        }

        if (!body.password || typeof body.password !== 'string') {
            throw new Error('Password is required');
        }

        const createdUser = await prisma.user.create({
            data: {
                fullName: body.fullName,
                email: body.email,
                password: hashSync(body.password, 10),
            },
        });

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.verificationCode.create({
            data: {
                code,
                userId: createdUser.id,
            },
        });

        // The verification email is best-effort: a delivery failure (e.g. the
        // Resend sandbox only allows sending to your own address) must NOT roll
        // back the freshly created account — otherwise the user is stuck, unable
        // to re-register because the unverified record already exists.
        try {
            await sendEmail(
                createdUser.email,
                'Next Pizza / 📝 Confirm your registration',
                React.createElement(VerificationUserTemplate, {
                    code,
                })
            );
        } catch (emailErr) {
            logger.error(
                { err: emailErr },
                '[registerUser] Verification email failed (non-blocking)'
            );
        }

        // In dev always log a ready-to-click verification link, so the user can
        // verify even when email delivery isn't working/configured.
        if (process.env.NODE_ENV !== 'production') {
            const baseUrl =
                process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
            logger.info(
                `[registerUser:dev] Verify ${createdUser.email}: ${baseUrl}/api/auth/verify?code=${code}`
            );
        }
    } catch (err) {
        logger.error({ err }, 'Error [CREATE_USER]');
        throw err;
    }
}
