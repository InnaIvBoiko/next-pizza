'use server';

import { prisma } from '@/prisma/prisma-client';
import {
    PayOrderTemplate,
    VerificationUserTemplate,
} from '@/shared/components/shared/email-temapltes';
import { CheckoutFormValues, getDeliveryPrice } from '@/shared/constants';
import { createPayment } from '@/shared/lib/create-payment';
import { sendEmail } from '@/shared/lib/send-email';
import { getUserSession } from '@/shared/lib/get-user-session';
import { logger } from '@/shared/lib/logger.server';
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
                totalAmount: userCart.totalAmount + getDeliveryPrice(userCart.totalAmount),
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
            deliveryPrice: getDeliveryPrice(userCart.totalAmount),
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
            logger.error(
                { err: emailErr },
                '[CreateOrder] Email send failed (non-blocking)'
            );
        }

        return paymentUrl;
    } catch (err) {
        logger.error({ err }, '[CreateOrder] Server error');
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
        logger.error({ err }, 'Error [UPDATE_USER]');
        throw err;
    }
}

export async function deleteUser() {
    try {
        const currentUser = await getUserSession();

        if (!currentUser) {
            throw new Error('User not found');
        }

        // Cascades remove the user's cart and verification code; orders keep
        // their records with the user reference set to null (see schema).
        await prisma.user.delete({
            where: {
                id: Number(currentUser.id),
            },
        });
    } catch (err) {
        logger.error({ err }, 'Error [DELETE_USER]');
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

        if (!body.password || typeof body.password !== 'string') {
            throw new Error('Password is required');
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

        // The verification email is best-effort: a delivery failure (e.g. the
        // Resend sandbox only allows sending to your own address) must NOT roll
        // back the freshly created account — otherwise the user is stuck, unable
        // to re-register because the unverified record already exists.
        try {
            await sendEmail(
                createdUser.email,
                'Next Pizza / 📝 Confirm your registration',
                React.createElement(VerificationUserTemplate, {
                    code,
                })
            );
        } catch (emailErr) {
            logger.error(
                { err: emailErr },
                '[registerUser] Verification email failed (non-blocking)'
            );
        }

        // In dev always log a ready-to-click verification link, so the user can
        // verify even when email delivery isn't working/configured.
        if (process.env.NODE_ENV !== 'production') {
            const baseUrl =
                process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
            logger.info(
                `[registerUser:dev] Verify ${createdUser.email}: ${baseUrl}/api/auth/verify?code=${code}`
            );
        }
    } catch (err) {
        logger.error({ err }, 'Error [CREATE_USER]');
        throw err;
    }
}
