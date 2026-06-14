import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { findOrCreateCart } from '@/shared/lib/find-or-create-cart';
import { updateCartTotalAmount } from '@/shared/lib/update-cart-total-amount';
import { CreateCartItemValues } from '@/shared/services/dto/cart.dto';

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
                    },
                },
            },
        });

        return NextResponse.json(userCart ?? emptyCart);
    } catch (error) {
        console.error('[CART_GET] Server error', error);
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

        const ingredientIds = (data.ingredients ?? [])
            .slice()
            .sort((a, b) => a - b);

        // Re-adding the exact same line (same product item AND same ingredient
        // set) bumps the quantity instead of creating a duplicate row.
        const candidates = await prisma.cartItem.findMany({
            where: { cartId: userCart.id, productItemId: data.productItemId },
            include: { ingredients: true },
        });

        const existingItem = candidates.find(item => {
            const ids = item.ingredients.map(i => i.id).sort((a, b) => a - b);
            return (
                ids.length === ingredientIds.length &&
                ids.every((id, i) => id === ingredientIds[i])
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
        console.error('[CART_POST] Server error', error);
        return NextResponse.json(
            { error: 'Could not add item to cart' },
            { status: 500 }
        );
    }
}
