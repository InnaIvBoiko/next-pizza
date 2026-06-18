'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '../ui';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { updateProduct } from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { useDictionary } from './i18n/dictionary-provider';

type Role = 'included' | 'extra';

interface Props {
    product: {
        id: number;
        name: string;
        description: string | null;
        imageUrl: string;
        includedIds: number[];
        extraIds: number[];
    };
    /** All ingredients with locale-appropriate names. */
    ingredients: { id: number; name: string }[];
}

export const AdminProductEditor: React.FC<Props> = ({
    product,
    ingredients,
}) => {
    const dict = useDictionary();
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [name, setName] = React.useState(product.name);
    const [description, setDescription] = React.useState(
        product.description ?? ''
    );
    const [imageUrl, setImageUrl] = React.useState(product.imageUrl);
    const [roles, setRoles] = React.useState<Record<number, Role>>(() => {
        const initial: Record<number, Role> = {};
        product.includedIds.forEach(id => (initial[id] = 'included'));
        product.extraIds.forEach(id => (initial[id] = 'extra'));
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

    const onSave = async () => {
        try {
            setLoading(true);
            const includedIds = Object.entries(roles)
                .filter(([, role]) => role === 'included')
                .map(([id]) => Number(id));
            const extraIds = Object.entries(roles)
                .filter(([, role]) => role === 'extra')
                .map(([id]) => Number(id));

            await updateProduct({
                id: product.id,
                name,
                description,
                imageUrl,
                includedIds,
                extraIds,
            });
            setOpen(false);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AdminProductEditor] save failed');
            toast.error(dict.admin.saveError);
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
            <Button
                variant='outline'
                size='sm'
                className='shrink-0 rounded-full'
                onClick={() => setOpen(true)}
            >
                <Pencil className='mr-1.5 size-4' />
                {dict.admin.edit}
            </Button>

            <Dialog
                open={open}
                onOpenChange={isOpen => {
                    if (!loading) setOpen(isOpen);
                }}
            >
                <DialogContent className='max-h-[90vh] w-full max-w-lg overflow-y-auto bg-card p-6'>
                    <DialogHeader>
                        <DialogTitle>{name}</DialogTitle>
                    </DialogHeader>

                    <div className='space-y-4'>
                        <label className='block'>
                            <span className='text-sm font-medium'>
                                {dict.admin.productName}
                            </span>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className={fieldClass}
                            />
                        </label>

                        <label className='block'>
                            <span className='text-sm font-medium'>
                                {dict.admin.productDescription}
                            </span>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={2}
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

                    <div className='mt-4 flex justify-end gap-2'>
                        <Button
                            variant='outline'
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            {dict.admin.cancel}
                        </Button>
                        <Button onClick={onSave} disabled={loading}>
                            {dict.admin.save}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
