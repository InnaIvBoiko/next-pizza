'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Plus } from 'lucide-react';
import { Button } from '../ui';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import {
    createIngredient,
    deleteIngredient,
    updateIngredient,
} from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { useDictionary } from './i18n/dictionary-provider';

interface IngredientData {
    id: number;
    name: string;
    nameIt: string | null;
    price: number;
    imageUrl: string;
}

interface Props {
    /** Omit for "create" mode. */
    ingredient?: IngredientData;
}

export const AdminIngredientEditor: React.FC<Props> = ({ ingredient }) => {
    const dict = useDictionary();
    const router = useRouter();
    const isCreate = !ingredient;
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const [name, setName] = React.useState(ingredient?.name ?? '');
    const [nameIt, setNameIt] = React.useState(ingredient?.nameIt ?? '');
    const [price, setPrice] = React.useState(
        ingredient ? String(ingredient.price) : ''
    );
    const [imageUrl, setImageUrl] = React.useState(ingredient?.imageUrl ?? '');

    const onSave = async () => {
        try {
            setLoading(true);
            const base = {
                name,
                nameIt,
                price: Number(price) || 0,
                imageUrl,
            };
            if (isCreate) {
                await createIngredient(base);
            } else {
                await updateIngredient({ ...base, id: ingredient.id });
            }
            setOpen(false);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AdminIngredientEditor] save failed');
            toast.error(dict.admin.saveError);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        if (!ingredient) return;
        try {
            setLoading(true);
            await deleteIngredient(ingredient.id);
            setOpen(false);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AdminIngredientEditor] delete failed');
            toast.error(dict.admin.deleteError);
        } finally {
            setLoading(false);
        }
    };

    const fieldClass =
        'mt-1 w-full rounded-xl bg-muted px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

    return (
        <>
            {isCreate ? (
                <Button
                    size='sm'
                    className='shrink-0 rounded-full'
                    onClick={() => setOpen(true)}
                >
                    <Plus className='mr-1.5 size-4' />
                    {dict.admin.newIngredient}
                </Button>
            ) : (
                <Button
                    variant='outline'
                    size='sm'
                    className='shrink-0 rounded-full'
                    onClick={() => setOpen(true)}
                >
                    <Pencil className='mr-1.5 size-4' />
                    {dict.admin.edit}
                </Button>
            )}

            <Dialog
                open={open}
                onOpenChange={isOpen => {
                    if (!loading) {
                        setOpen(isOpen);
                        if (!isOpen) setConfirmDelete(false);
                    }
                }}
            >
                <DialogContent className='w-full max-w-md bg-card p-6'>
                    <DialogHeader>
                        <DialogTitle>
                            {isCreate ? dict.admin.newIngredient : name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className='space-y-4'>
                        <div className='grid gap-4 sm:grid-cols-2'>
                            <label className='block'>
                                <span className='text-sm font-medium'>
                                    {dict.admin.nameEn}
                                </span>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={fieldClass}
                                />
                            </label>
                            <label className='block'>
                                <span className='text-sm font-medium'>
                                    {dict.admin.nameIt}
                                </span>
                                <input
                                    value={nameIt}
                                    onChange={e => setNameIt(e.target.value)}
                                    className={fieldClass}
                                />
                            </label>
                        </div>

                        <label className='block'>
                            <span className='text-sm font-medium'>
                                {dict.admin.price}
                            </span>
                            <input
                                type='number'
                                min='0'
                                step='0.5'
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className={fieldClass}
                            />
                        </label>

                        <label className='block'>
                            <span className='text-sm font-medium'>
                                {dict.admin.productImage}
                            </span>
                            <input
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                className={fieldClass}
                            />
                        </label>
                    </div>

                    {confirmDelete ? (
                        <div className='mt-4 rounded-xl bg-destructive/10 p-3'>
                            <p className='text-sm font-medium text-destructive'>
                                {dict.admin.deleteIngredientConfirm}
                            </p>
                            <div className='mt-3 flex justify-end gap-2'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => setConfirmDelete(false)}
                                    disabled={loading}
                                >
                                    {dict.admin.cancel}
                                </Button>
                                <Button
                                    variant='destructive'
                                    size='sm'
                                    onClick={onDelete}
                                    disabled={loading}
                                >
                                    {dict.admin.delete}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className='mt-4 flex items-center justify-between gap-2'>
                            {!isCreate ? (
                                <Button
                                    variant='destructive'
                                    onClick={() => setConfirmDelete(true)}
                                    disabled={loading}
                                >
                                    {dict.admin.delete}
                                </Button>
                            ) : (
                                <span />
                            )}
                            <div className='flex gap-2'>
                                <Button
                                    variant='outline'
                                    onClick={() => setOpen(false)}
                                    disabled={loading}
                                >
                                    {dict.admin.cancel}
                                </Button>
                                <Button onClick={onSave} disabled={loading}>
                                    {isCreate
                                        ? dict.admin.create
                                        : dict.admin.save}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
