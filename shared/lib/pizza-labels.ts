import {
    pizzaSizeValues,
    pizzaTypeValues,
    type PizzaSize,
    type PizzaType,
} from '../constants/pizza';
import type { Dictionary } from './i18n/types';

// Localized display names for pizza sizes/types, resolved from the active
// dictionary. Keys in the JSON are strings ("20", "1"), hence the String().

export const pizzaSizeName = (dict: Dictionary, size: PizzaSize): string =>
    dict.pizza.sizes[String(size) as keyof Dictionary['pizza']['sizes']];

export const pizzaTypeName = (dict: Dictionary, type: PizzaType): string =>
    dict.pizza.types[String(type) as keyof Dictionary['pizza']['types']];

export const buildPizzaSizeVariants = (dict: Dictionary) =>
    pizzaSizeValues.map((value) => ({
        name: pizzaSizeName(dict, value),
        value: String(value),
    }));

export const buildPizzaTypeVariants = (dict: Dictionary) =>
    pizzaTypeValues.map((value) => ({
        name: pizzaTypeName(dict, value),
        value: String(value),
    }));
