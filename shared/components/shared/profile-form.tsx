'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    TFormProfileValues,
    makeProfileSchema,
} from './modals/auth-modal/forms/schemas';
import { User } from '@/generated/prisma/client';
import { toast } from 'sonner';
import { logger } from '@/shared/lib/logger.client';
import { signOut } from 'next-auth/react';
import { FormInput } from './form';
import { Button } from '../ui';
import { DeleteAccountModal } from './modals';
import { useDictionary } from './i18n/dictionary-provider';
import { updateUserInfo } from '@/app/actions';

interface Props {
    data: User;
}

export const ProfileForm: React.FC<Props> = ({ data }) => {
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const dict = useDictionary();
    const schema = React.useMemo(
        () => makeProfileSchema(dict.validation),
        [dict]
    );

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: data.fullName,
            email: data.email,
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: TFormProfileValues) => {
        try {
            await updateUserInfo({
                email: data.email,
                fullName: data.fullName,
                password: data.password,
            });

            toast.success(dict.profile.updateSuccess, {
                icon: '✅',
            });
        } catch (error) {
            logger.error({ err: error }, '[ProfileForm] Update failed');
            return toast.error(dict.profile.updateError, {
                icon: '❌',
            });
        }
    };

    const onClickSignOut = () => {
        signOut({
            callbackUrl: '/',
        });
    };

    return (
        <>
            <FormProvider {...form}>
                <form
                    className='flex w-full flex-col gap-5'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormInput
                        name='email'
                        label={dict.profile.email}
                        required
                    />
                    <FormInput
                        name='fullName'
                        label={dict.profile.fullName}
                        required
                    />

                    <FormInput
                        type='password'
                        name='password'
                        label={dict.profile.newPassword}
                    />
                    <FormInput
                        type='password'
                        name='confirmPassword'
                        label={dict.profile.confirmPassword}
                    />

                    <Button
                        disabled={form.formState.isSubmitting}
                        className='mt-10 text-base'
                        type='submit'
                    >
                        {dict.profile.save}
                    </Button>

                    <Button
                        onClick={onClickSignOut}
                        variant='secondary'
                        disabled={form.formState.isSubmitting}
                        className='text-base'
                        type='button'
                    >
                        {dict.profile.signOut}
                    </Button>

                    <Button
                        onClick={() => setOpenDeleteModal(true)}
                        variant='destructive'
                        disabled={form.formState.isSubmitting}
                        className='text-base'
                        type='button'
                    >
                        {dict.profile.deleteAccount}
                    </Button>
                </form>
            </FormProvider>

            <DeleteAccountModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            />
        </>
    );
};
