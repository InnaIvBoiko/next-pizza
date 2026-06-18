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
import { ProfilePanel } from '../profile-panel';
import { Title } from '../title';
import { User } from '@/generated/prisma/client';

interface Props {
    user: User;
    title: string;
    accountLabel: string;
    ordersLabel: string;
    /** Highlighted active-order card (server node), if any. */
    activeOrder?: React.ReactNode;
    /** Order history list (server node). */
    orders: React.ReactNode;
}

export const ProfileModal: React.FC<Props> = ({
    user,
    title,
    accountLabel,
    ordersLabel,
    activeOrder,
    orders,
}) => {
    const router = useRouter();

    return (
        <Dialog open onOpenChange={() => router.back()}>
            <DialogContent className='max-h-[90vh] w-full max-w-[calc(100%-1.5rem)] overflow-y-auto bg-card p-6 sm:max-w-lg sm:p-8'>
                <DialogTitle className='sr-only'>{title}</DialogTitle>
                <DialogDescription className='sr-only'>{title}</DialogDescription>
                <Title text={title} size='md' className='font-bold' />
                <div className='mt-6'>
                    <ProfilePanel
                        accountLabel={accountLabel}
                        ordersLabel={ordersLabel}
                        account={<ProfileForm data={user} />}
                        orders={orders}
                        activeOrder={activeOrder}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
