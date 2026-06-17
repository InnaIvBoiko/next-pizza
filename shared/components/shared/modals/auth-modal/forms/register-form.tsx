'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { logger } from '@/shared/lib/logger.client';

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

            toast.success('Registrazione completata 📝 Conferma la tua email.', {
                icon: '✅',
            });

            onClose?.();
        } catch (error) {
            logger.error({ err: error }, 'Error [REGISTER]');
            toast.error('Impossibile registrarsi. L\'email potrebbe essere già in uso.', {
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
                    <Title text='Crea un account' size='md' />
                    <p className='text-muted-foreground'>
                        Inserisci i tuoi dati per creare un account
                    </p>
                </div>

                <FormInput name='email' label='E-mail' required />
                <FormInput name='fullName' label='Nome completo' required />
                <FormInput
                    type='password'
                    name='password'
                    label='Password'
                    required
                />
                <FormInput
                    type='password'
                    name='confirmPassword'
                    label='Conferma password'
                    required
                />

                <Button
                    disabled={form.formState.isSubmitting}
                    className='h-12 text-base'
                    type='submit'
                >
                    Registrati
                </Button>
            </form>
        </FormProvider>
    );
};
