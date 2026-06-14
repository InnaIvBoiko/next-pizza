import { prisma } from '@/prisma/prisma-client';

/**
 * Return the cart for the given (anonymous) token, creating an empty one the
 * first time a visitor adds something. Server-only: imports Prisma, so it must
 * not be re-exported from the client-facing lib barrel.
 */
export const findOrCreateCart = async (token: string) => {
    let userCart = await prisma.cart.findFirst({ where: { token } });

    if (!userCart) {
        userCart = await prisma.cart.create({ data: { token } });
    }

    return userCart;
};
