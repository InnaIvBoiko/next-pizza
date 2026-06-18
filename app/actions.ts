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

/** Staff: remove (mark bought) a shopping list item. */
export async function removeShoppingItem(id: number) {
    try {
        const session = await getUserSession();
        if (
            !session ||
            (session.role !== 'ADMIN' && session.role !== 'KITCHEN')
        ) {
            throw new Error('Forbidden');
        }

        await prisma.shoppingItem.delete({ where: { id } });
    } catch (err) {
        logger.error({ err }, '[RemoveShoppingItem] Server error');
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
