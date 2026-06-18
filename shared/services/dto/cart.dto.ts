/**
 * Shapes returned by the cart API. Defined as plain interfaces (rather than
 * derived from the generated Prisma client) so the lib/store layer compiles
 * independently of the cart backend, which is not implemented yet.
 */
export interface CartItemDTO {
    id: number;
    quantity: number;
    productItem: {
        id: number;
        price: number;
        size: number | null;
        pizzaType: number | null;
        product: {
            id: number;
            name: string;
            imageUrl: string;
        };
    };
    ingredients: Array<{
        id: number;
        name: string;
        price: number;
        imageUrl: string;
    }>;
    // Included ingredients the customer removed (free; for display/kitchen).
    removedIngredients: Array<{
        id: number;
        name: string;
    }>;
}

export interface CreateCartItemValues {
    productItemId: number;
    ingredients?: number[];
    removedIngredients?: number[];
}

export interface CartDTO {
    id: number;
    totalAmount: number;
    items: CartItemDTO[];
}
