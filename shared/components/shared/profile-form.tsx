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
    // Start read-only: show email + name with an "Edit" button; the full,
    // editable form (password, save, delete) only appears on demand.
    const [isEditing, setIsEditing] = React.useState(false);
    const [profile, setProfile] = React.useState({
        email: data.email,
        fullName: data.fullName,
    });

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

    const onSubmit = async (values: TFormProfileValues) => {
        try {
            await updateUserInfo({
                email: values.email,
                fullName: values.fullName,
                password: values.password,
            });

            setProfile({ email: values.email, fullName: values.fullName });
            setIsEditing(false);

            toast.success(dict.profile.updateSuccess, { icon: '✅' });
        } catch (error) {
            logger.error({ err: error }, '[ProfileForm] Update failed');
            return toast.error(dict.profile.updateError, { icon: '❌' });
        }
    };

    const startEditing = () => {
        form.reset({
            email: profile.email,
            fullName: profile.fullName,
            password: '',
            confirmPassword: '',
        });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        form.reset({
            email: profile.email,
            fullName: profile.fullName,
            password: '',
            confirmPassword: '',
        });
        setIsEditing(false);
    };

    const onClickSignOut = () => signOut({ callbackUrl: '/' });

    if (!isEditing) {
        return (
            <div className='flex w-full flex-col gap-5'>
                <div>
                    <p className='text-sm text-muted-foreground'>
                        {dict.profile.email}
                    </p>
                    <p className='mt-1 font-medium break-all'>
                        {profile.email}
                    </p>
                </div>
                <div>
                    <p className='text-sm text-muted-foreground'>
                        {dict.profile.fullName}
                    </p>
                    <p className='mt-1 font-medium'>{profile.fullName}</p>
                </div>

                <Button
                    type='button'
                    className='mt-4 text-base'
                    onClick={startEditing}
                >
                    {dict.profile.edit}
                </Button>
                <Button
                    type='button'
                    variant='secondary'
                    className='text-base'
                    onClick={onClickSignOut}
                >
                    {dict.profile.signOut}
                </Button>
            </div>
        );
    }

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
                        className='mt-6 text-base'
                        type='submit'
                    >
                        {dict.profile.save}
                    </Button>

                    <Button
                        onClick={cancelEditing}
                        variant='outline'
                        disabled={form.formState.isSubmitting}
                        className='text-base'
                        type='button'
                    >
                        {dict.profile.cancel}
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
