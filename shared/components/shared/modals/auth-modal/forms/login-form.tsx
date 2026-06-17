'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Title } from '../../../title';
import { FormInput } from '../../../form';
import { Button } from '../../../../ui';
import { formLoginSchema, TFormLoginValues } from './schemas';

interface Props {
    onClose?: () => void;
}

const ERROR_MESSAGES: Record<string, string> = {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_NOT_VERIFIED: 'Please confirm your email before logging in.',
    OAUTH_ACCOUNT: 'This account uses Google sign-in. Use the button below.',
};

export const LoginForm: React.FC<Props> = ({ onClose }) => {
    const form = useForm<TFormLoginValues>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: TFormLoginValues) => {
        const resp = await signIn('credentials', {
            ...data,
            redirect: false,
        });

        if (resp?.ok) {
            toast.success('You have successfully logged in 🎉', {
                icon: '✅',
            });
            onClose?.();
            return;
        }

        // NextAuth puts the code thrown by authorize() into resp.error.
        const message =
            (resp?.error && ERROR_MESSAGES[resp.error]) ??
            'Could not log in. Please try again.';

        toast.error(message, { icon: '❌' });
    };

    return (
        <FormProvider {...form}>
            <form
                className='flex flex-col gap-5'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className='mb-2 flex items-center justify-between'>
                    <div className='mr-2'>
                        <Title text='Log in to your account' size='md' />
                        <p className='text-gray-400'>
                            Enter your email to log in to your account
                        </p>
                    </div>
                </div>

                <FormInput name='email' label='E-Mail' required />
                <FormInput
                    type='password'
                    name='password'
                    label='Password'
                    required
                />

                <Button
                    disabled={form.formState.isSubmitting}
                    className='h-12 text-base'
                    type='submit'
                >
                    Log In
                </Button>
            </form>
        </FormProvider>
    );
};
