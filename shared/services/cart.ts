import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { CartDTO, CreateCartItemValues } from './dto/cart.dto';

export const getCart = async (): Promise<CartDTO> =>
    (await axiosInstance.get<CartDTO>(ApiRoutes.CART)).data;

export const addCartItem = async (
    values: CreateCartItemValues
): Promise<CartDTO> =>
    (await axiosInstance.post<CartDTO>(ApiRoutes.CART, values)).data;

export const updateItemQuantity = async (
    id: number,
    quantity: number
): Promise<CartDTO> =>
    (await axiosInstance.patch<CartDTO>(`${ApiRoutes.CART}/${id}`, { quantity }))
        .data;

export const removeCartItem = async (id: number): Promise<CartDTO> =>
    (await axiosInstance.delete<CartDTO>(`${ApiRoutes.CART}/${id}`)).data;
