'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Title } from '../../../title';
import { FormInput } from '../../../form';
import { Button } from '../../../../ui';
import { registerUser } from '@/app/actions';
import { formRegisterSchema, TFormRegisterValues } from './schemas';

interface Props {
    onClose?: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onClose }) => {
    const form = useForm<TFormRegisterValues>({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            email: '',
            fullName: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: TFormRegisterValues) => {
        try {
            await registerUser({
                email: data.email,
                fullName: data.fullName,
                password: data.password,
            });

            toast.success('Registration successful 📝 Confirm your email.', {
                icon: '✅',
            });

            onClose?.();
        } catch (error) {
            console.error('Error [REGISTER]', error);
            toast.error('Could not register. The email may already be in use.', {
                icon: '❌',
            });
        }
    };

    return (
        <FormProvider {...form}>
            <form
                className='flex flex-col gap-5'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className='mb-2'>
                    <Title text='Create an account' size='md' />
                    <p className='text-gray-400'>
                        Enter your details to create an account
                    </p>
                </div>

                <FormInput name='email' label='E-Mail' required />
                <FormInput name='fullName' label='Full Name' required />
                <FormInput
                    type='password'
                    name='password'
                    label='Password'
                    required
                />
                <FormInput
                    type='password'
                    name='confirmPassword'
                    label='Confirm Password'
                    required
                />

                <Button
                    disabled={form.formState.isSubmitting}
                    className='h-12 text-base'
                    type='submit'
                >
                    Register
                </Button>
            </form>
        </FormProvider>
    );
};
