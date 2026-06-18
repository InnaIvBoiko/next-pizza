/**
 * A product can be made only if every one of its included (base) ingredients is
 * in stock. Extras don't count: they're optional and disabled individually when
 * out of stock. An empty list (e.g. a drink with no ingredients) is available.
 */
export const isProductAvailable = (
    ingredients: { available: boolean }[]
): boolean => ingredients.every(ingredient => ingredient.available);
