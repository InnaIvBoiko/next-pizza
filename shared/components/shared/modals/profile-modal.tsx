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
            <DialogContent className='w-120 max-w-120 bg-white p-8'>
                <DialogTitle className='sr-only'>My Profile</DialogTitle>
                <DialogDescription className='sr-only'>
                    Manage your account
                </DialogDescription>
                <Title text='My Profile' size='md' className='font-bold' />
                <div className='mt-6'>
                    <ProfileForm data={user} />
                </div>
            </DialogContent>
        </Dialog>
    );
};
