import { ProductItem } from '@/generated/prisma/client';
import { PizzaType } from '../constants/pizza';
import { Variant } from '../components/shared/group-variants';
import { buildPizzaSizeVariants } from './pizza-labels';
import type { Dictionary } from './i18n/types';

export const getAvailablePizzaSizes = (
    type: PizzaType,
    items: ProductItem[],
    dict: Dictionary
): Variant[] => {
    const filteredPizzasByType = items.filter(item => item.pizzaType === type);

    return buildPizzaSizeVariants(dict).map(item => ({
        name: item.name,
        value: item.value,
        disabled: !filteredPizzasByType.some(
            pizza => Number(pizza.size) === Number(item.value)
        ),
    }));
};
