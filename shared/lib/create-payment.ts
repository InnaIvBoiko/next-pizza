import { stripe } from './stripe';

// Origin used to build Stripe's success/cancel redirect URLs. NEXT_PUBLIC_API_URL
// is only a path ("/api"), so we keep a dedicated base URL with a localhost fallback.
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

interface CreatePaymentProps {
    orderId: number;
    cartAmount: number;
    deliveryPrice: number;
}

/**
 * Creates a Stripe Checkout Session for an order and returns it. Use `session.url`
 * to redirect the customer to the hosted payment page and `session.id` as the
 * stored payment id. Cart and delivery are charged as two separate line items so
 * the customer sees the breakdown. In test mode no real money moves (card
 * 4242 4242 4242 4242).
 */
export async function createPayment({
    orderId,
    cartAmount,
    deliveryPrice,
}: CreatePaymentProps) {
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: { name: `Order #${orderId}` },
                    // Stripe expects the amount in the smallest currency unit (cents).
                    unit_amount: Math.round(cartAmount * 100),
                },
                quantity: 1,
            },
            {
                price_data: {
                    currency: 'eur',
                    product_data: { name: 'Delivery' },
                    unit_amount: Math.round(deliveryPrice * 100),
                },
                quantity: 1,
            },
        ],
        metadata: { orderId: String(orderId) },
        success_url: `${baseUrl}/checkout/success?orderId=${orderId}`,
        cancel_url: `${baseUrl}/checkout?canceled=${orderId}`,
    });

    return session;
}
