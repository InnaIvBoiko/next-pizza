'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Button } from '../ui';
import { addShoppingItem, removeShoppingItem } from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { useDictionary } from './i18n/dictionary-provider';

interface Item {
    id: number;
    label: string;
    ingredientId: number | null;
}

interface Props {
    items: Item[];
}

/** Shared shopping list: add free-text items, remove (mark bought). */
export const ShoppingList: React.FC<Props> = ({ items }) => {
    const dict = useDictionary();
    const router = useRouter();
    const [value, setValue] = React.useState('');
    const [busy, setBusy] = React.useState(false);

    const onAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;
        try {
            setBusy(true);
            await addShoppingItem(value);
            setValue('');
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[ShoppingList] add failed');
            toast.error(dict.inventory.updateError);
        } finally {
            setBusy(false);
        }
    };

    const onRemove = async (id: number) => {
        try {
            await removeShoppingItem(id);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[ShoppingList] remove failed');
            toast.error(dict.inventory.updateError);
        }
    };

    return (
        <div>
            <form onSubmit={onAdd} className='flex gap-2'>
                <input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={dict.inventory.addPlaceholder}
                    className='flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
                <Button
                    type='submit'
                    size='sm'
                    disabled={busy}
                    className='rounded-full'
                >
                    {dict.inventory.add}
                </Button>
            </form>

            {items.length === 0 ? (
                <p className='mt-4 text-sm text-muted-foreground'>
                    {dict.inventory.shoppingEmpty}
                </p>
            ) : (
                <ul className='mt-4 space-y-2'>
                    {items.map(item => (
                        <li
                            key={item.id}
                            className='flex items-center justify-between gap-3 rounded-2xl bg-muted/60 px-4 py-2'
                        >
                            <span className='flex min-w-0 items-center gap-2'>
                                <span className='truncate font-medium'>
                                    {item.label}
                                </span>
                                {item.ingredientId !== null && (
                                    <span className='rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-destructive'>
                                        {dict.inventory.auto}
                                    </span>
                                )}
                            </span>
                            <button
                                type='button'
                                onClick={() => onRemove(item.id)}
                                className='inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-foreground'
                            >
                                <X className='size-4' />
                                {dict.inventory.remove}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
