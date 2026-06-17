'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { logger } from '@/shared/lib/logger.client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui';
import { useDictionary } from '../i18n/dictionary-provider';
import { deleteUser } from '@/app/actions';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const DeleteAccountModal: React.FC<Props> = ({ open, onClose }) => {
    const dict = useDictionary();
    const [loading, setLoading] = React.useState(false);

    const onConfirm = async () => {
        try {
            setLoading(true);
            await deleteUser();

            toast.success(dict.deleteAccount.successToast, { icon: '🗑️' });

            // Clear the session and leave the (now non-existent) profile page.
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            logger.error({ err: error }, 'Error [DELETE_ACCOUNT]');
            toast.error(dict.deleteAccount.errorToast, {
                icon: '❌',
            });
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={isOpen => {
                if (!isOpen && !loading) {
                    onClose();
                }
            }}
        >
            <DialogContent className='w-110 bg-card p-8'>
                <DialogHeader>
                    <DialogTitle>{dict.deleteAccount.title}</DialogTitle>
                    <DialogDescription>
                        {dict.deleteAccount.description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className='mt-4 gap-2'>
                    <Button
                        variant='outline'
                        type='button'
                        disabled={loading}
                        onClick={onClose}
                    >
                        {dict.deleteAccount.cancel}
                    </Button>
                    <Button
                        variant='destructive'
                        type='button'
                        disabled={loading}
                        onClick={onConfirm}
                    >
                        {dict.deleteAccount.confirm}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
