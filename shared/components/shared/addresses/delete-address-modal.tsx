'use client';

import React from 'react';

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

interface Props {
    open: boolean;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmation dialog for deleting a saved delivery address. */
export const DeleteAddressModal: React.FC<Props> = ({
    open,
    loading,
    onClose,
    onConfirm,
}) => {
    const dict = useDictionary();

    return (
        <Dialog
            open={open}
            onOpenChange={isOpen => {
                if (!isOpen && !loading) {
                    onClose();
                }
            }}
        >
            <DialogContent className='w-110 max-w-[calc(100vw-2rem)] bg-card p-8'>
                <DialogHeader>
                    <DialogTitle>
                        {dict.addresses.deleteConfirmTitle}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.addresses.deleteConfirmText}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className='mt-4 gap-2'>
                    <Button
                        variant='outline'
                        type='button'
                        disabled={loading}
                        onClick={onClose}
                    >
                        {dict.addresses.deleteConfirmKeep}
                    </Button>
                    <Button
                        variant='destructive'
                        type='button'
                        disabled={loading}
                        onClick={onConfirm}
                    >
                        {dict.addresses.deleteConfirmYes}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
