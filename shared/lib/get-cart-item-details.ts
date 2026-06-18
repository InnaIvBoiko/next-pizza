import { PizzaSize, PizzaType } from '../constants/pizza';
import { CartStateItem } from './get-cart-details';
import { pizzaTypeName } from './pizza-labels';
import { format } from './i18n/format';
import type { Dictionary } from './i18n/types';

export const getCartItemDetails = (
    dict: Dictionary,
    ingredients: CartStateItem['ingredients'],
    removedIngredients: CartStateItem['removedIngredients'],
    pizzaType?: PizzaType,
    pizzaSize?: PizzaSize
): string => {
    const details = [];

    if (pizzaSize && pizzaType) {
        details.push(
            format(dict.cart.itemDetailsTemplate, {
                type: pizzaTypeName(dict, pizzaType),
                size: pizzaSize,
            })
        );
    }

    if (removedIngredients?.length) {
        details.push(
            ...removedIngredients.map(
                ingredient => `${dict.product.without} ${ingredient.name}`
            )
        );
    }

    if (ingredients) {
        details.push(...ingredients.map(ingredient => ingredient.name));
    }

    return details.join(', ');
};
