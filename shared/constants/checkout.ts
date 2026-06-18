// Italian VAT for prepared food / delivery is 10%. Prices are VAT-inclusive
// (Italian B2C convention), so VAT is extracted from the total, never added.
export const VAT = 10;

// Delivery fee in EUR, charged on top of the cart total.
export const DELIVERY_PRICE = 3.5;

// Cart total (EUR) at or above which delivery is free. Matches the home promo.
export const FREE_DELIVERY_THRESHOLD = 25;

// Delivery fee for a given cart total: free once the threshold is reached.
export const getDeliveryPrice = (cartAmount: number) =>
    cartAmount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_PRICE;
