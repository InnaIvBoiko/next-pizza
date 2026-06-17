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
import { deleteUser } from '@/app/actions';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const DeleteAccountModal: React.FC<Props> = ({ open, onClose }) => {
    const [loading, setLoading] = React.useState(false);

    const onConfirm = async () => {
        try {
            setLoading(true);
            await deleteUser();

            toast.success('Your account has been deleted.', { icon: '🗑️' });

            // Clear the session and leave the (now non-existent) profile page.
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            logger.error({ err: error }, 'Error [DELETE_ACCOUNT]');
            toast.error('Could not delete the account. Please try again.', {
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
            <DialogContent className='w-110 bg-white p-8'>
                <DialogHeader>
                    <DialogTitle>Delete account</DialogTitle>
                    <DialogDescription>
                        This action is permanent. Your account and cart will be
                        removed and cannot be recovered. Are you sure?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className='mt-4 gap-2'>
                    <Button
                        variant='outline'
                        type='button'
                        disabled={loading}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='destructive'
                        type='button'
                        disabled={loading}
                        onClick={onConfirm}
                    >
                        Delete my account
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
