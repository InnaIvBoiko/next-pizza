/**
 * Formats a numeric price as "€ 12,00" — euro symbol, a space, the amount with
 * a comma decimal separator and always two decimals (Italian/EU convention).
 */
export const formatPrice = (price: number): string =>
    `€ ${price.toFixed(2).replace('.', ',')}`;
