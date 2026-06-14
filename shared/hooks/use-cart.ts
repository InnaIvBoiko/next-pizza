import React from 'react';
import { useCartStore } from '../store';
import { CreateCartItemValues } from '../services/dto/cart.dto';
import { CartStateItem } from '../lib/get-cart-details';

type ReturnProps = {
    totalAmount: number;
    items: CartStateItem[];
    loading: boolean;
    updateItemQuantity: (id: number, quantity: number) => void;
    removeCartItem: (id: number) => void;
    addCartItem: (values: CreateCartItemValues) => void;
};

export const useCart = (): ReturnProps => {
    const cartState = useCartStore(state => state);
    const fetchCartItems = useCartStore(state => state.fetchCartItems);

    // Fetch once on mount. `cartState` can't be the dependency: fetchCartItems
    // mutates the store, which gives `cartState` a new identity and would
    // re-trigger the effect forever. The action itself is a stable reference.
    React.useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    return cartState;
};
