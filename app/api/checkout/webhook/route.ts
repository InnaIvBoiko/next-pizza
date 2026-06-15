import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import React from 'react';
import { stripe } from '@/shared/lib/stripe';
import { prisma } from '@/prisma/prisma-client';
import { OrderStatus } from '@/generated/prisma/client';
import { sendEmail } from '@/shared/lib/send-email';
import { OrderSuccessTemplate } from '@/shared/components/shared/email-temapltes';
import { CartItemDTO } from '@/shared/services/dto/cart.dto';

// Stripe's SDK needs Node APIs, not the Edge runtime.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        return NextResponse.json(
            { error: 'Missing Stripe signature or webhook secret' },
            { status: 400 }
        );
    }

    // Verify the event really came from Stripe using the raw request body.
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('[Stripe webhook] Signature verification failed', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = Number(session.metadata?.orderId);

        if (!orderId) {
            return NextResponse.json(
                { error: 'orderId missing in session metadata' },
                { status: 400 }
            );
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.SUCCEEDED },
        });

        // items is a JSON column holding a stringified cart snapshot (see createOrder).
        const items = JSON.parse(order.items as string) as CartItemDTO[];

        await sendEmail(
            order.email,
            'Next Pizza / Your order is confirmed #' + order.id,
            React.createElement(OrderSuccessTemplate, {
                orderId: order.id,
                items,
            })
        );
    }

    return NextResponse.json({ received: true });
}
