import { calcTotalPizzaPrice } from './calc-total-pizza-price';
import { Ingredient, ProductItem } from '@/generated/prisma/client';
import { PizzaSize, PizzaType } from '../constants/pizza';
import { pizzaTypeName } from './pizza-labels';
import { format } from './i18n/format';
import type { Dictionary } from './i18n/types';

export const getPizzaDetails = (
    type: PizzaType,
    size: PizzaSize,
    items: ProductItem[],
    ingredients: Ingredient[],
    selectedIngredients: Set<number>,
    dict: Dictionary
) => {
    const totalPrice = calcTotalPizzaPrice(
        type,
        size,
        items,
        ingredients,
        selectedIngredients
    );
    const textDetaills = format(dict.product.detailsTemplate, {
        size,
        type: pizzaTypeName(dict, type),
    });

    return { totalPrice, textDetaills };
};
