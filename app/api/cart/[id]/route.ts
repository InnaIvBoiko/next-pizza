import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { updateCartTotalAmount } from '@/shared/lib/update-cart-total-amount';
import { logger } from '@/shared/lib/logger.server';

const CART_TOKEN = 'cartToken';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = req.cookies.get(CART_TOKEN)?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Cart token not found' },
                { status: 400 }
            );
        }

        const { quantity } = (await req.json()) as { quantity: number };

        await prisma.cartItem.update({
            where: { id: Number(id) },
            data: { quantity },
        });

        const updatedCart = await updateCartTotalAmount(token);
        return NextResponse.json(updatedCart);
    } catch (error) {
        logger.error({ err: error }, '[CART_PATCH] Server error');
        return NextResponse.json(
            { error: 'Could not update cart item' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = req.cookies.get(CART_TOKEN)?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Cart token not found' },
                { status: 400 }
            );
        }

        await prisma.cartItem.delete({ where: { id: Number(id) } });

        const updatedCart = await updateCartTotalAmount(token);
        return NextResponse.json(updatedCart);
    } catch (error) {
        logger.error({ err: error }, '[CART_DELETE] Server error');
        return NextResponse.json(
            { error: 'Could not remove cart item' },
            { status: 500 }
        );
    }
}
