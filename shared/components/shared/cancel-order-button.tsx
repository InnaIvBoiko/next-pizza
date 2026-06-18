'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { Button } from '../ui';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { cancelOrder } from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { useDictionary } from './i18n/dictionary-provider';

interface Props {
    orderId: number;
    className?: string;
}

/**
 * Cancel an unpaid order, behind a confirmation dialog. On success refreshes so
 * the order moves into the order history.
 */
export const CancelOrderButton: React.FC<Props> = ({ orderId, className }) => {
    const dict = useDictionary();
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onConfirm = async () => {
        try {
            setLoading(true);
            await cancelOrder(orderId);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[CancelOrderButton] failed');
            toast.error(dict.orders.cancelError);
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() => setOpen(true)}
                className={cn('rounded-full', className)}
            >
                {dict.orders.cancel}
            </Button>

            <Dialog
                open={open}
                onOpenChange={isOpen => {
                    if (!loading) setOpen(isOpen);
                }}
            >
                <DialogContent className='w-full max-w-[calc(100%-1.5rem)] bg-card p-6 sm:max-w-md sm:p-8'>
                    <DialogHeader>
                        <DialogTitle>
                            {dict.orders.cancelConfirmTitle}
                        </DialogTitle>
                        <DialogDescription>
                            {dict.orders.cancelConfirmText}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className='mt-4 gap-2'>
                        <Button
                            variant='outline'
                            type='button'
                            disabled={loading}
                            onClick={() => setOpen(false)}
                        >
                            {dict.orders.cancelConfirmKeep}
                        </Button>
                        <Button
                            variant='destructive'
                            type='button'
                            disabled={loading}
                            onClick={onConfirm}
                        >
                            {dict.orders.cancelConfirmYes}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
