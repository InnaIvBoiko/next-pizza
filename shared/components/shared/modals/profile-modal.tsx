'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { ProfileForm } from '../profile-form';
import { Title } from '../title';
import { User } from '@/generated/prisma/client';

interface Props {
    user: User;
}

export const ProfileModal: React.FC<Props> = ({ user }) => {
    const router = useRouter();

    return (
        <Dialog open onOpenChange={() => router.back()}>
            <DialogContent className='max-h-[90vh] w-full max-w-[calc(100%-1.5rem)] overflow-y-auto bg-card p-6 sm:max-w-120 sm:p-8'>
                <DialogTitle className='sr-only'>Il mio profilo</DialogTitle>
                <DialogDescription className='sr-only'>
                    Manage your account
                </DialogDescription>
                <Title text='Il mio profilo' size='md' className='font-bold' />
                <div className='mt-6'>
                    <ProfileForm data={user} />
                </div>
            </DialogContent>
        </Dialog>
    );
};
