export const mapPizzaSize = {
    20: 'Piccola',
    30: 'Media',
    40: 'Grande',
} as const;

export const mapPizzaType = {
    1: 'tradizionale',
    2: 'sottile',
} as const;

export const pizzaSizes = Object.entries(mapPizzaSize).map(([value, name]) => ({
    name,
    value,
}));

export const pizzaTypes = Object.entries(mapPizzaType).map(([value, name]) => ({
    name,
    value,
}));

export type PizzaSize = keyof typeof mapPizzaSize;
export type PizzaType = keyof typeof mapPizzaType;
