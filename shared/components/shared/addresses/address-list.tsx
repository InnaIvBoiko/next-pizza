'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MapPin, Plus, Star } from 'lucide-react';

import type { Address } from '@/generated/prisma/client';
import { AddressFormValues } from '@/shared/constants';
import {
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { cn } from '@/shared/lib/utils';
import { Button } from '../../ui';
import { AddressForm } from './address-form';
import { DeleteAddressModal } from './delete-address-modal';
import { useDictionary } from '../i18n/dictionary-provider';

interface Props {
    addresses: Address[];
}

/**
 * Saved delivery addresses with full CRUD: add, edit (inline), delete (with
 * confirm) and "set as default". Mutations go through server actions, then
 * `router.refresh()` re-pulls the list from the server component that owns it.
 */
export const AddressList: React.FC<Props> = ({ addresses }) => {
    const dict = useDictionary();
    const router = useRouter();

    const [adding, setAdding] = React.useState(false);
    const [editingId, setEditingId] = React.useState<number | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = React.useState<number | null>(
        null
    );
    const [submitting, setSubmitting] = React.useState(false);

    const closeForms = () => {
        setAdding(false);
        setEditingId(null);
    };

    const handleCreate = async (values: AddressFormValues) => {
        try {
            setSubmitting(true);
            await createAddress(values);
            toast.success(dict.addresses.createSuccess, { icon: '📍' });
            closeForms();
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AddressList] Create failed');
            toast.error(dict.addresses.error, { icon: '❌' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (id: number, values: AddressFormValues) => {
        try {
            setSubmitting(true);
            await updateAddress({ id, ...values });
            toast.success(dict.addresses.updateSuccess, { icon: '📍' });
            closeForms();
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AddressList] Update failed');
            toast.error(dict.addresses.error, { icon: '❌' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultAddress(id);
            toast.success(dict.addresses.defaultSuccess, { icon: '⭐' });
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AddressList] Set default failed');
            toast.error(dict.addresses.error, { icon: '❌' });
        }
    };

    const handleDelete = async () => {
        if (pendingDeleteId === null) return;
        try {
            setSubmitting(true);
            await deleteAddress(pendingDeleteId);
            toast.success(dict.addresses.deleteSuccess, { icon: '🗑️' });
            setPendingDeleteId(null);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AddressList] Delete failed');
            toast.error(dict.addresses.error, { icon: '❌' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='flex w-full flex-col gap-4'>
            {addresses.length === 0 && !adding && (
                <p className='text-muted-foreground'>{dict.addresses.empty}</p>
            )}

            <ul className='flex flex-col gap-4'>
                {addresses.map(address =>
                    editingId === address.id ? (
                        <li
                            key={address.id}
                            className='glass rounded-2xl p-4 sm:p-5'
                        >
                            <AddressForm
                                submitting={submitting}
                                lockDefault={address.isDefault}
                                defaultValues={{
                                    street: address.street,
                                    houseNumber: address.houseNumber,
                                    city: address.city,
                                    postalCode: address.postalCode,
                                    isDefault: address.isDefault,
                                }}
                                onSubmit={values =>
                                    handleUpdate(address.id, values)
                                }
                                onCancel={() => setEditingId(null)}
                            />
                        </li>
                    ) : (
                        <li
                            key={address.id}
                            className={cn(
                                'glass rounded-2xl p-4 sm:p-5',
                                address.isDefault && 'ring-2 ring-primary/40'
                            )}
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <div className='flex items-start gap-3'>
                                    <MapPin className='mt-0.5 h-5 w-5 shrink-0 text-primary' />
                                    <div>
                                        <p className='font-medium break-words'>
                                            {address.formatted}
                                        </p>
                                        {address.isDefault && (
                                            <span className='mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary'>
                                                <Star className='h-3 w-3 fill-current' />
                                                {dict.addresses.default}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='mt-4 flex flex-wrap gap-2'>
                                {!address.isDefault && (
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() =>
                                            handleSetDefault(address.id)
                                        }
                                    >
                                        {dict.addresses.makeDefault}
                                    </Button>
                                )}
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => setEditingId(address.id)}
                                >
                                    {dict.addresses.edit}
                                </Button>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    className='text-destructive hover:text-destructive'
                                    onClick={() =>
                                        setPendingDeleteId(address.id)
                                    }
                                >
                                    {dict.addresses.delete}
                                </Button>
                            </div>
                        </li>
                    )
                )}
            </ul>

            {adding ? (
                <div className='glass rounded-2xl p-4 sm:p-5'>
                    <AddressForm
                        submitting={submitting}
                        onSubmit={handleCreate}
                        onCancel={() => setAdding(false)}
                    />
                </div>
            ) : (
                <Button
                    type='button'
                    variant='secondary'
                    className='text-base'
                    onClick={() => {
                        setEditingId(null);
                        setAdding(true);
                    }}
                >
                    <Plus className='mr-1 h-4 w-4' />
                    {dict.addresses.add}
                </Button>
            )}

            <DeleteAddressModal
                open={pendingDeleteId !== null}
                loading={submitting}
                onClose={() => setPendingDeleteId(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
};
