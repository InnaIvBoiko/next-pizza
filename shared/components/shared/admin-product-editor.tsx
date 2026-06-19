'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Plus, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '../ui';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { createProduct, deleteProduct, updateProduct } from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { pizzaSizeValues, pizzaTypeValues } from '@/shared/constants/pizza';
import { useDictionary } from './i18n/dictionary-provider';

type Role = 'included' | 'extra';

interface Variant {
    id: number | null;
    price: string;
    size: number | null;
    pizzaType: number | null;
}

interface ProductData {
    id: number;
    name: string;
    nameIt: string | null;
    description: string | null;
    descriptionIt: string | null;
    imageUrl: string;
    categoryId: number;
    includedIds: number[];
    extraIds: number[];
    items: {
        id: number;
        price: number;
        size: number | null;
        pizzaType: number | null;
    }[];
}

interface Props {
    /** Omit for "create" mode. */
    product?: ProductData;
    categories: { id: number; name: string }[];
    /** All ingredients with locale-appropriate names. */
    ingredients: { id: number; name: string }[];
}

export const AdminProductEditor: React.FC<Props> = ({
    product,
    categories,
    ingredients,
}) => {
    const dict = useDictionary();
    const router = useRouter();
    const isCreate = !product;
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const [name, setName] = React.useState(product?.name ?? '');
    const [nameIt, setNameIt] = React.useState(product?.nameIt ?? '');
    const [description, setDescription] = React.useState(
        product?.description ?? ''
    );
    const [descriptionIt, setDescriptionIt] = React.useState(
        product?.descriptionIt ?? ''
    );
    const [imageUrl, setImageUrl] = React.useState(product?.imageUrl ?? '');
    const [categoryId, setCategoryId] = React.useState<number>(
        product?.categoryId ?? categories[0]?.id ?? 0
    );
    const [variants, setVariants] = React.useState<Variant[]>(() =>
        product && product.items.length
            ? product.items.map(item => ({
                  id: item.id,
                  price: String(item.price),
                  size: item.size,
                  pizzaType: item.pizzaType,
              }))
            : [{ id: null, price: '', size: null, pizzaType: null }]
    );
    const [roles, setRoles] = React.useState<Record<number, Role>>(() => {
        const initial: Record<number, Role> = {};
        product?.includedIds.forEach(id => (initial[id] = 'included'));
        product?.extraIds.forEach(id => (initial[id] = 'extra'));
        return initial;
    });

    // Toggling a role: same role again clears it; the other role replaces it.
    const setRole = (id: number, role: Role) =>
        setRoles(prev => {
            const next = { ...prev };
            if (next[id] === role) delete next[id];
            else next[id] = role;
            return next;
        });

    const setVariant = (index: number, patch: Partial<Variant>) =>
        setVariants(prev =>
            prev.map((v, i) => (i === index ? { ...v, ...patch } : v))
        );
    const addVariant = () =>
        setVariants(prev => [
            ...prev,
            { id: null, price: '', size: null, pizzaType: null },
        ]);
    const removeVariant = (index: number) =>
        setVariants(prev => prev.filter((_, i) => i !== index));

    const onSave = async () => {
        // Every variant needs a positive price; a pizza variant needs BOTH a
        // size and a dough (the customer prices by the exact size×dough pair),
        // a plain item needs neither. Half-set variants are unreachable.
        const invalid = variants.some(v => {
            const hasSize = v.size !== null;
            const hasType = v.pizzaType !== null;
            return !(Number(v.price) > 0) || hasSize !== hasType;
        });
        if (invalid) {
            toast.error(dict.admin.variantInvalid);
            return;
        }

        try {
            setLoading(true);
            const includedIds = Object.entries(roles)
                .filter(([, role]) => role === 'included')
                .map(([id]) => Number(id));
            const extraIds = Object.entries(roles)
                .filter(([, role]) => role === 'extra')
                .map(([id]) => Number(id));

            const items = variants.map(v => ({
                id: v.id ?? undefined,
                price: Number(v.price) || 0,
                size: v.size,
                pizzaType: v.pizzaType,
            }));

            const base = {
                name,
                nameIt,
                description,
                descriptionIt,
                imageUrl,
                categoryId,
                includedIds,
                extraIds,
                items,
            };

            if (isCreate) {
                await createProduct(base);
            } else {
                await updateProduct({ ...base, id: product.id });
            }
            setOpen(false);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AdminProductEditor] save failed');
            toast.error(dict.admin.saveError);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        if (!product) return;
        try {
            setLoading(true);
            await deleteProduct(product.id);
            setOpen(false);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AdminProductEditor] delete failed');
            toast.error(dict.admin.deleteError);
        } finally {
            setLoading(false);
        }
    };

    const fieldClass =
        'mt-1 w-full rounded-xl bg-muted px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';
    const pill = (active: boolean) =>
        cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold transition-colors',
            active
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:text-foreground'
        );

    return (
        <>
            {isCreate ? (
                <Button
                    size='sm'
                    className='shrink-0 rounded-full'
                    onClick={() => setOpen(true)}
                >
                    <Plus className='mr-1.5 size-4' />
                    {dict.admin.newProduct}
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
                <DialogContent className='max-h-[90vh] w-full max-w-lg overflow-y-auto bg-card p-6'>
                    <DialogHeader>
                        <DialogTitle>
                            {isCreate ? dict.admin.newProduct : name}
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

                        <div className='grid gap-4 sm:grid-cols-2'>
                            <label className='block'>
                                <span className='text-sm font-medium'>
                                    {dict.admin.descriptionEn}
                                </span>
                                <textarea
                                    value={description}
                                    onChange={e =>
                                        setDescription(e.target.value)
                                    }
                                    rows={2}
                                    className={fieldClass}
                                />
                            </label>
                            <label className='block'>
                                <span className='text-sm font-medium'>
                                    {dict.admin.descriptionIt}
                                </span>
                                <textarea
                                    value={descriptionIt}
                                    onChange={e =>
                                        setDescriptionIt(e.target.value)
                                    }
                                    rows={2}
                                    className={fieldClass}
                                />
                            </label>
                        </div>

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

                        <label className='block'>
                            <span className='text-sm font-medium'>
                                {dict.admin.category}
                            </span>
                            <select
                                value={categoryId}
                                onChange={e =>
                                    setCategoryId(Number(e.target.value))
                                }
                                className={fieldClass}
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div>
                            <div className='mb-2 flex items-center justify-between'>
                                <p className='text-sm font-medium'>
                                    {dict.admin.variants}
                                </p>
                                <button
                                    type='button'
                                    onClick={addVariant}
                                    className='inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-foreground'
                                >
                                    <Plus className='size-4' />
                                    {dict.admin.addVariant}
                                </button>
                            </div>
                            <div className='space-y-2'>
                                {variants.map((variant, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center gap-2 rounded-xl bg-muted/60 px-2 py-2'
                                    >
                                        <select
                                            aria-label={dict.admin.size}
                                            value={variant.size ?? ''}
                                            onChange={e =>
                                                setVariant(index, {
                                                    size: e.target.value
                                                        ? Number(e.target.value)
                                                        : null,
                                                })
                                            }
                                            className='min-w-0 flex-1 rounded-lg bg-background px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                        >
                                            <option value=''>
                                                {dict.admin.size}
                                            </option>
                                            {pizzaSizeValues.map(size => (
                                                <option key={size} value={size}>
                                                    {
                                                        dict.pizza.sizes[
                                                            String(
                                                                size
                                                            ) as keyof typeof dict.pizza.sizes
                                                        ]
                                                    }
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            aria-label={dict.admin.dough}
                                            value={variant.pizzaType ?? ''}
                                            onChange={e =>
                                                setVariant(index, {
                                                    pizzaType: e.target.value
                                                        ? Number(e.target.value)
                                                        : null,
                                                })
                                            }
                                            className='min-w-0 flex-1 rounded-lg bg-background px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                        >
                                            <option value=''>
                                                {dict.admin.dough}
                                            </option>
                                            {pizzaTypeValues.map(type => (
                                                <option key={type} value={type}>
                                                    {
                                                        dict.pizza.types[
                                                            String(
                                                                type
                                                            ) as keyof typeof dict.pizza.types
                                                        ]
                                                    }
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type='number'
                                            min='0'
                                            step='0.5'
                                            aria-label={dict.admin.price}
                                            placeholder={dict.admin.price}
                                            value={variant.price}
                                            onChange={e =>
                                                setVariant(index, {
                                                    price: e.target.value,
                                                })
                                            }
                                            className='w-20 shrink-0 rounded-lg bg-background px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                        />
                                        <button
                                            type='button'
                                            aria-label={dict.admin.delete}
                                            disabled={variants.length === 1}
                                            onClick={() => removeVariant(index)}
                                            className='shrink-0 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-30'
                                        >
                                            <X className='size-4' />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className='mb-2 text-sm font-medium'>
                                {dict.admin.includedLabel} /{' '}
                                {dict.admin.extraLabel}
                            </p>
                            <ul className='scrollbar max-h-60 space-y-1 overflow-y-auto'>
                                {ingredients.map(ingredient => (
                                    <li
                                        key={ingredient.id}
                                        className='flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-3 py-1.5'
                                    >
                                        <span className='truncate text-sm'>
                                            {ingredient.name}
                                        </span>
                                        <span className='flex shrink-0 gap-1'>
                                            <button
                                                type='button'
                                                className={pill(
                                                    roles[ingredient.id] ===
                                                        'included'
                                                )}
                                                onClick={() =>
                                                    setRole(
                                                        ingredient.id,
                                                        'included'
                                                    )
                                                }
                                            >
                                                {dict.admin.includedLabel}
                                            </button>
                                            <button
                                                type='button'
                                                className={pill(
                                                    roles[ingredient.id] ===
                                                        'extra'
                                                )}
                                                onClick={() =>
                                                    setRole(
                                                        ingredient.id,
                                                        'extra'
                                                    )
                                                }
                                            >
                                                {dict.admin.extraLabel}
                                            </button>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {confirmDelete ? (
                        <div className='mt-4 rounded-xl bg-destructive/10 p-3'>
                            <p className='text-sm font-medium text-destructive'>
                                {dict.admin.deleteConfirm}
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
