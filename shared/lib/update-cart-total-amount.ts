import { prisma } from '@/prisma/prisma-client';

// Everything the cart DTO needs: each line's product + its chosen ingredients,
// newest line first.
const cartInclude = {
    items: {
        orderBy: { createdAt: 'desc' as const },
        include: {
            productItem: { include: { product: true } },
            ingredients: true,
        },
    },
};

/**
 * Recalculate a cart's totalAmount from its current items and persist it.
 * Returns the fully-included cart (the shape the API hands back to the client),
 * or null if no cart matches the token. Server-only (imports Prisma).
 */
export const updateCartTotalAmount = async (token: string) => {
    const userCart = await prisma.cart.findFirst({
        where: { token },
        include: cartInclude,
    });

    if (!userCart) {
        return null;
    }

    const totalAmount = userCart.items.reduce((acc, item) => {
        const ingredientsPrice = item.ingredients.reduce(
            (sum, ingredient) => sum + ingredient.price,
            0
        );
        return acc + (ingredientsPrice + item.productItem.price) * item.quantity;
    }, 0);

    return prisma.cart.update({
        where: { id: userCart.id },
        data: { totalAmount },
        include: cartInclude,
    });
};
