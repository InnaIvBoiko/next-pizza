'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    TFormProfileValues,
    formProfileSchema,
} from './modals/auth-modal/forms/schemas';
import { User } from '@/generated/prisma/client';
import { toast } from 'sonner';
import { logger } from '@/shared/lib/logger.client';
import { signOut } from 'next-auth/react';
import { FormInput } from './form';
import { Button } from '../ui';
import { DeleteAccountModal } from './modals';
import { updateUserInfo } from '@/app/actions';

interface Props {
    data: User;
}

export const ProfileForm: React.FC<Props> = ({ data }) => {
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formProfileSchema),
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

            toast.success('Profile updated successfully 📝', {
                icon: '✅',
            });
        } catch (error) {
            logger.error({ err: error }, '[ProfileForm] Update failed');
            return toast.error('Error updating profile', {
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
                    <FormInput name='email' label='E-Mail' required />
                    <FormInput name='fullName' label='Full Name' required />

                    <FormInput
                        type='password'
                        name='password'
                        label='New Password (leave blank to keep current)'
                    />
                    <FormInput
                        type='password'
                        name='confirmPassword'
                        label='Confirm Password'
                    />

                    <Button
                        disabled={form.formState.isSubmitting}
                        className='mt-10 text-base'
                        type='submit'
                    >
                        Save
                    </Button>

                    <Button
                        onClick={onClickSignOut}
                        variant='secondary'
                        disabled={form.formState.isSubmitting}
                        className='text-base'
                        type='button'
                    >
                        Sign Out
                    </Button>

                    <Button
                        onClick={() => setOpenDeleteModal(true)}
                        variant='destructive'
                        disabled={form.formState.isSubmitting}
                        className='text-base'
                        type='button'
                    >
                        Delete account
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
