// Numeric, locale-independent pizza option values. Display labels live in the
// dictionaries (`pizza.sizes` / `pizza.types`) and are resolved through the
// helpers in `shared/lib/pizza-labels`.

export const pizzaSizeValues = [20, 30, 40] as const;
export const pizzaTypeValues = [1, 2] as const;

export type PizzaSize = (typeof pizzaSizeValues)[number];
export type PizzaType = (typeof pizzaTypeValues)[number];
