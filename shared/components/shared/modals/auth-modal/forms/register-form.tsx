'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { logger } from '@/shared/lib/logger.client';

import { Title } from '../../../title';
import { FormInput } from '../../../form';
import { Button } from '../../../../ui';
import { useDictionary } from '../../../i18n/dictionary-provider';
import { registerUser } from '@/app/actions';
import { makeRegisterSchema, TFormRegisterValues } from './schemas';

interface Props {
    onClose?: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onClose }) => {
    const dict = useDictionary();
    const schema = React.useMemo(
        () => makeRegisterSchema(dict.validation),
        [dict]
    );

    const form = useForm<TFormRegisterValues>({
        resolver: zodResolver(schema),
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

            toast.success(dict.auth.register.successToast, {
                icon: '✅',
            });

            onClose?.();
        } catch (error) {
            logger.error({ err: error }, 'Error [REGISTER]');
            toast.error(dict.auth.register.errorToast, {
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
                    <Title text={dict.auth.register.title} size='md' />
                    <p className='text-muted-foreground'>
                        {dict.auth.register.description}
                    </p>
                </div>

                <FormInput
                    name='email'
                    label={dict.auth.register.email}
                    required
                />
                <FormInput
                    name='fullName'
                    label={dict.auth.register.fullName}
                    required
                />
                <FormInput
                    type='password'
                    name='password'
                    label={dict.auth.register.password}
                    required
                />
                <FormInput
                    type='password'
                    name='confirmPassword'
                    label={dict.auth.register.confirmPassword}
                    required
                />

                <Button
                    disabled={form.formState.isSubmitting}
                    className='h-12 text-base'
                    type='submit'
                >
                    {dict.auth.register.submit}
                </Button>
            </form>
        </FormProvider>
    );
};
