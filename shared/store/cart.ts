import { create } from 'zustand';
import { Api } from '../services/api-client';
import { getCartDetails } from '../lib/get-cart-details';
import { CartStateItem } from '../lib/get-cart-details';
import { CreateCartItemValues } from '../services/dto/cart.dto';
import { logger } from '../lib/logger.client';

export interface CartState {
    loading: boolean;
    error: boolean;
    totalAmount: number;
    items: CartStateItem[];

    /* Fetch cart items */
    fetchCartItems: () => Promise<void>;

    /* Request to update item quantity */
    updateItemQuantity: (id: number, quantity: number) => Promise<void>;

    /* Request to add item to cart */
    addCartItem: (values: CreateCartItemValues) => Promise<void>;

    /* Request to remove item from cart */
    removeCartItem: (id: number) => Promise<void>;
}

export const useCartStore = create<CartState>(set => ({
    items: [],
    error: false,
    // Starts false: nothing fetches the cart on mount yet (the fetch-on-mount
    // useCart hook is not wired up). Flip back to true once the cart backend +
    // hook exist so the drawer shows a loading state on first open.
    loading: false,
    totalAmount: 0,

    fetchCartItems: async () => {
        try {
            set({ loading: true, error: false });
            const data = await Api.cart.getCart();
            set(getCartDetails(data));
        } catch (error) {
            logger.error({ err: error }, '[Cart] fetchCartItems failed');
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

    updateItemQuantity: async (id: number, quantity: number) => {
        try {
            set({ loading: true, error: false });
            const data = await Api.cart.updateItemQuantity(id, quantity);
            set(getCartDetails(data));
        } catch (error) {
            logger.error({ err: error }, '[Cart] updateItemQuantity failed');
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

    removeCartItem: async (id: number) => {
        try {
            set(state => ({
                loading: true,
                error: false,
                items: state.items.map(item =>
                    item.id === id ? { ...item, disabled: true } : item
                ),
            }));
            const data = await Api.cart.removeCartItem(id);
            set(getCartDetails(data));
        } catch (error) {
            logger.error({ err: error }, '[Cart] removeCartItem failed');
            set({ error: true });
        } finally {
            set(state => ({
                loading: false,
                items: state.items.map(item => ({ ...item, disabled: false })),
            }));
        }
    },

    addCartItem: async (values: CreateCartItemValues) => {
        try {
            set({ loading: true, error: false });
            const data = await Api.cart.addCartItem(values);
            set(getCartDetails(data));
        } catch (error) {
            logger.error({ err: error }, '[Cart] addCartItem failed');
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },
}));
