import { CreateCartItemValues } from './dto/cart.dto';
import { CartDTO } from './dto/cart.dto';

/**
 * TODO: Cart backend not implemented yet (render-only scope).
 *
 * To enable persistence, replace these stubs with real calls against the
 * /api/cart routes, e.g.:
 *   return (await axiosInstance.get<CartDTO>(ApiRoutes.CART)).data;
 * and add the matching route handlers + Prisma cart-token/cookie logic.
 */
const notImplemented = (): never => {
    throw new Error('Cart API is not implemented yet');
};

export const getCart = async (): Promise<CartDTO> => notImplemented();

export const addCartItem = async (
    _values: CreateCartItemValues
): Promise<CartDTO> => notImplemented();

export const updateItemQuantity = async (
    _id: number,
    _quantity: number
): Promise<CartDTO> => notImplemented();

export const removeCartItem = async (_id: number): Promise<CartDTO> =>
    notImplemented();
