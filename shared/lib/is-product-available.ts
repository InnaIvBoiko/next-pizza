/**
 * A product is orderable only when staff haven't manually marked it out of stock
 * (`available`) AND every one of its included (base) ingredients is in stock.
 * Extras don't count: they're optional and disabled individually when out of
 * stock. An empty ingredient list (e.g. a drink) is available.
 */
export const isProductAvailable = (product: {
    available: boolean;
    ingredients: { available: boolean }[];
}): boolean =>
    product.available &&
    product.ingredients.every(ingredient => ingredient.available);
