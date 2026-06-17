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
    INVALID_CREDENTIALS: 'Email o password non validi.',
    EMAIL_NOT_VERIFIED: 'Conferma la tua email prima di accedere.',
    OAUTH_ACCOUNT:
        'Questo account utilizza l\'accesso con Google. Usa il pulsante qui sotto.',
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
            toast.success('Hai effettuato l\'accesso con successo 🎉', {
                icon: '✅',
            });
            onClose?.();
            return;
        }

        // NextAuth puts the code thrown by authorize() into resp.error.
        const message =
            (resp?.error && ERROR_MESSAGES[resp.error]) ??
            'Impossibile accedere. Riprova.';

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
                        <Title text='Accedi al tuo account' size='md' />
                        <p className='text-muted-foreground'>
                            Inserisci la tua email per accedere al tuo account
                        </p>
                    </div>
                </div>

                <FormInput name='email' label='E-mail' required />
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
                    Accedi
                </Button>
            </form>
        </FormProvider>
    );
};
