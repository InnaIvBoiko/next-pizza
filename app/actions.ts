'use server';

import { prisma } from '@/prisma/prisma-client';
import {
    PayOrderTemplate,
    VerificationUserTemplate,
} from '@/shared/components/shared/email-temapltes';
import { CheckoutFormValues, DELIVERY_PRICE } from '@/shared/constants';
import { createPayment } from '@/shared/lib/create-payment';
import { sendEmail } from '@/shared/lib/send-email';
import { getUserSession } from '@/shared/lib/get-user-session';
import { OrderStatus, Prisma } from '@/generated/prisma/client';
import { hashSync } from 'bcrypt';
import { cookies } from 'next/headers';
import React from 'react';

export async function createOrder(data: CheckoutFormValues) {
    try {
        const cookieStore = await cookies();
        const cartToken = cookieStore.get('cartToken')?.value;

        if (!cartToken) {
            throw new Error('Cart token not found');
        }

        /* Finding the cart by token */
        const userCart = await prisma.cart.findFirst({
            include: {
                user: true,
                items: {
                    include: {
                        ingredients: true,
                        productItem: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
            where: {
                token: cartToken,
            },
        });

        /* If the cart is not found return an error */
        if (!userCart) {
            throw new Error('Cart not found');
        }

        /* If the cart is empty return an error */
        if (userCart?.totalAmount === 0) {
            throw new Error('Cart is empty');
        }

        /* Creating an order */
        const order = await prisma.order.create({
            data: {
                token: cartToken,
                fullName: data.firstName + ' ' + data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                comment: data.comment,
                // Charged total = cart + delivery (matches the checkout sidebar).
                totalAmount: userCart.totalAmount + DELIVERY_PRICE,
                status: OrderStatus.PENDING,
                items: JSON.stringify(userCart.items),
            },
        });

        /* Clearing the cart */
        await prisma.cart.update({
            where: {
                id: userCart.id,
            },
            data: {
                totalAmount: 0,
            },
        });

        await prisma.cartItem.deleteMany({
            where: {
                cartId: userCart.id,
            },
        });

        const paymentData = await createPayment({
            orderId: order.id,
            cartAmount: userCart.totalAmount,
            deliveryPrice: DELIVERY_PRICE,
        });

        if (!paymentData || !paymentData.url) {
            throw new Error('Payment data not found');
        }

        await prisma.order.update({
            where: {
                id: order.id,
            },
            data: {
                paymentId: paymentData.id,
            },
        });

        const paymentUrl = paymentData.url;

        // Email is non-critical: never let a send failure block the payment redirect.
        try {
            await sendEmail(
                data.email,
                'Next Pizza / Pay for order #' + order.id,
                React.createElement(PayOrderTemplate, {
                    orderId: order.id,
                    totalAmount: order.totalAmount,
                    paymentUrl,
                })
            );
        } catch (emailErr) {
            console.error('[CreateOrder] Email send failed (non-blocking)', emailErr);
        }

        return paymentUrl;
    } catch (err) {
        console.log('[CreateOrder] Server error', err);
    }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
    try {
        const currentUser = await getUserSession();

        if (!currentUser) {
            throw new Error('User not found');
        }

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(currentUser.id),
            },
        });

        await prisma.user.update({
            where: {
                id: Number(currentUser.id),
            },
            data: {
                fullName: body.fullName,
                email: body.email,
                password: body.password
                    ? hashSync(body.password as string, 10)
                    : findUser?.password,
            },
        });
    } catch (err) {
        console.log('Error [UPDATE_USER]', err);
        throw err;
    }
}

export async function registerUser(body: Prisma.UserCreateInput) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
            },
        });

        if (user) {
            if (!user.verified) {
                throw new Error('User not verified');
            }

            throw new Error('User already exists');
        }

        const createdUser = await prisma.user.create({
            data: {
                fullName: body.fullName,
                email: body.email,
                password: hashSync(body.password, 10),
            },
        });

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.verificationCode.create({
            data: {
                code,
                userId: createdUser.id,
            },
        });

        await sendEmail(
            createdUser.email,
            'Next Pizza / 📝 Confirm your registration',
            React.createElement(VerificationUserTemplate, {
                code,
            })
        );
    } catch (err) {
        console.log('Error [CREATE_USER]', err);
        throw err;
    }
}
