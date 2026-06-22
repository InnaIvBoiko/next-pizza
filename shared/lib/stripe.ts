import Stripe from 'stripe';

// Lazy singleton — the instance is created only on first use, not at import time.
// This prevents the build from failing when STRIPE_SECRET_KEY is absent (e.g. CI build step).
let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
    if (!_stripe) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
        _stripe = new Stripe(key);
    }
    return _stripe;
}
