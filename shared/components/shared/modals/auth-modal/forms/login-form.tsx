'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Title } from '../../../title';
import { FormInput } from '../../../form';
import { Button } from '../../../../ui';
import { useDictionary } from '../../../i18n/dictionary-provider';
import { makeLoginSchema, TFormLoginValues } from './schemas';

interface Props {
    onClose?: () => void;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
    const dict = useDictionary();
    const schema = React.useMemo(
        () => makeLoginSchema(dict.validation),
        [dict]
    );

    const form = useForm<TFormLoginValues>({
        resolver: zodResolver(schema),
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
            toast.success(dict.auth.login.successToast, {
                icon: '✅',
            });
            onClose?.();
            return;
        }

        // NextAuth puts the code thrown by authorize() into resp.error.
        const errors = dict.auth.login.errors;
        const message =
            (resp?.error &&
                errors[resp.error as keyof typeof errors]) ??
            dict.auth.login.errorToast;

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
                        <Title text={dict.auth.login.title} size='md' />
                        <p className='text-muted-foreground'>
                            {dict.auth.login.description}
                        </p>
                    </div>
                </div>

                <FormInput
                    name='email'
                    label={dict.auth.login.email}
                    required
                />
                <FormInput
                    type='password'
                    name='password'
                    label={dict.auth.login.password}
                    required
                />

                <Button
                    disabled={form.formState.isSubmitting}
                    className='h-12 text-base'
                    type='submit'
                >
                    {dict.auth.login.submit}
                </Button>
            </form>
        </FormProvider>
    );
};
