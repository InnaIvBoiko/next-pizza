'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    CheckoutSidebar,
    Container,
    Title,
    CheckoutAddressForm,
    CheckoutCart,
    CheckoutPersonalForm,
} from '@/shared/components';
import { CheckoutFormValues, checkoutFormSchema } from '@/shared/constants';
import { useCart } from '@/shared/hooks';
import { createOrder } from '@/app/actions';
import { toast } from 'sonner';
import React from 'react';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
    const [submitting, setSubmitting] = React.useState(false);
    const { totalAmount, updateItemQuantity, items, removeCartItem, loading } =
        useCart();
    const { data: session } = useSession();

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            comment: '',
        },
    });

    React.useEffect(() => {
        function fetchUserInfoFromSession() {
            if (!session?.user) return;
            const fullName = session.user.name ?? '';
            const [firstName = '', lastName = ''] = fullName.split(' ');

            form.setValue('firstName', firstName);
            form.setValue('lastName', lastName);
            form.setValue('email', session.user.email ?? '');
        }

        if (session) {
            fetchUserInfoFromSession();
        }
    }, [session, form]);

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);

            const url = await createOrder(data);

            toast.success(
                'Order created successfully! 📝 Redirecting to payment... ',
                {
                    icon: '✅',
                }
            );

            if (url) {
                window.location.assign(url);
            }
        } catch (err) {
            console.log(err);
            setSubmitting(false);
            toast.error('Failed to create order', {
                icon: '❌',
            });
        }
    };

    const onClickCountButton = (
        id: number,
        quantity: number,
        type: 'plus' | 'minus'
    ) => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity);
    };

    return (
        <Container className='mt-10'>
            <Title
                text='Checkout'
                className='mb-8 text-[36px] font-extrabold'
            />

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='flex gap-10'>
                        {/* Left side */}
                        <div className='mb-20 flex flex-1 flex-col gap-10'>
                            <CheckoutCart
                                onClickCountButton={onClickCountButton}
                                removeCartItem={removeCartItem}
                                items={items}
                                loading={loading}
                            />

                            <CheckoutPersonalForm
                                className={
                                    loading
                                        ? 'pointer-events-none opacity-40'
                                        : ''
                                }
                            />

                            <CheckoutAddressForm
                                className={
                                    loading
                                        ? 'pointer-events-none opacity-40'
                                        : ''
                                }
                            />
                        </div>

                        {/* Right side */}
                        <div className='w-112.5'>
                            <CheckoutSidebar
                                totalAmount={totalAmount}
                                loading={loading || submitting}
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </Container>
    );
}
