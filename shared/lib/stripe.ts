import Stripe from 'stripe';

// Single shared Stripe client so create-payment and the webhook never drift apart.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');
