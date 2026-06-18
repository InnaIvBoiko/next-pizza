import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { findOrCreateCart } from '@/shared/lib/find-or-create-cart';
import { updateCartTotalAmount } from '@/shared/lib/update-cart-total-amount';
import { CreateCartItemValues } from '@/shared/services/dto/cart.dto';
import { isProductAvailable } from '@/shared/lib/is-product-available';
import { logger } from '@/shared/lib/logger.server';

const CART_TOKEN = 'cartToken';
const CART_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Returned when the visitor has no cart yet, so the client can render an empty
// cart without special-casing null.
const emptyCart = { id: 0, totalAmount: 0, items: [] };

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get(CART_TOKEN)?.value;

        if (!token) {
            return NextResponse.json(emptyCart);
        }

        const userCart = await prisma.cart.findFirst({
            where: { token },
            include: {
                items: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        productItem: { include: { product: true } },
                        ingredients: true,
                        removedIngredients: true,
                    },
                },
            },
        });

        return NextResponse.json(userCart ?? emptyCart);
    } catch (error) {
        logger.error({ err: error }, '[CART_GET] Server error');
        return NextResponse.json(
            { error: 'Could not fetch cart' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        let token = req.cookies.get(CART_TOKEN)?.value;

        if (!token) {
            token = crypto.randomUUID();
        }

        const userCart = await findOrCreateCart(token);
        const data = (await req.json()) as CreateCartItemValues;

        // Guard: a product whose included ingredient is out of stock can't be
        // ordered, even if a stale client bypasses the disabled button.
        const productItem = await prisma.productItem.findUnique({
            where: { id: data.productItemId },
            include: {
                product: {
                    include: { ingredients: { select: { available: true } } },
                },
            },
        });

        if (!productItem) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        if (!isProductAvailable(productItem.product.ingredients)) {
            return NextResponse.json(
                { error: 'Product is not available' },
                { status: 409 }
            );
        }

        const ingredientIds = (data.ingredients ?? [])
            .slice()
            .sort((a, b) => a - b);
        const removedIngredientIds = (data.removedIngredients ?? [])
            .slice()
            .sort((a, b) => a - b);

        const sameIds = (a: number[], b: number[]) =>
            a.length === b.length && a.every((id, i) => id === b[i]);

        // Re-adding the exact same line (same product item, same extras AND same
        // removed ingredients) bumps the quantity instead of duplicating a row.
        const candidates = await prisma.cartItem.findMany({
            where: { cartId: userCart.id, productItemId: data.productItemId },
            include: { ingredients: true, removedIngredients: true },
        });

        const existingItem = candidates.find(item => {
            const extras = item.ingredients
                .map(i => i.id)
                .sort((a, b) => a - b);
            const removed = item.removedIngredients
                .map(i => i.id)
                .sort((a, b) => a - b);
            return (
                sameIds(extras, ingredientIds) &&
                sameIds(removed, removedIngredientIds)
            );
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + 1 },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: userCart.id,
                    productItemId: data.productItemId,
                    quantity: 1,
                    ingredients: {
                        connect: ingredientIds.map(id => ({ id })),
                    },
                    removedIngredients: {
                        connect: removedIngredientIds.map(id => ({ id })),
                    },
                },
            });
        }

        const updatedCart = await updateCartTotalAmount(token);

        const resp = NextResponse.json(updatedCart);
        resp.cookies.set(CART_TOKEN, token, {
            path: '/',
            maxAge: CART_TOKEN_MAX_AGE,
        });
        return resp;
    } catch (error) {
        logger.error({ err: error }, '[CART_POST] Server error');
        return NextResponse.json(
            { error: 'Could not add item to cart' },
            { status: 500 }
        );
    }
}
