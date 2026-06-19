'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Check, Pencil, Tag, Trash2, X } from 'lucide-react';
import { Button } from '../ui';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import {
    createCategory,
    deleteCategory,
    updateCategory,
} from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { localizeName } from '@/shared/lib/i18n/localize-name';
import { useDictionary, useLocale } from './i18n/dictionary-provider';

interface Category {
    id: number;
    name: string;
    nameIt: string | null;
    productCount: number;
}

interface Props {
    categories: Category[];
}

export const AdminCategoryManager: React.FC<Props> = ({ categories }) => {
    const dict = useDictionary();
    const locale = useLocale();
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [busy, setBusy] = React.useState(false);

    const [editingId, setEditingId] = React.useState<number | null>(null);
    const [editName, setEditName] = React.useState('');
    const [editNameIt, setEditNameIt] = React.useState('');
    const [confirmId, setConfirmId] = React.useState<number | null>(null);

    const [newName, setNewName] = React.useState('');
    const [newNameIt, setNewNameIt] = React.useState('');

    const run = async (fn: () => Promise<void>) => {
        try {
            setBusy(true);
            await fn();
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AdminCategoryManager] action failed');
            toast.error(dict.admin.saveError);
        } finally {
            setBusy(false);
        }
    };

    const startEdit = (category: Category) => {
        setEditingId(category.id);
        setEditName(category.name);
        setEditNameIt(category.nameIt ?? '');
        setConfirmId(null);
    };

    const onSaveEdit = (id: number) =>
        run(async () => {
            await updateCategory(id, editName, editNameIt);
            setEditingId(null);
        });

    const onDelete = (id: number) =>
        run(async () => {
            await deleteCategory(id);
            setConfirmId(null);
        });

    const onAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        run(async () => {
            await createCategory(newName, newNameIt);
            setNewName('');
            setNewNameIt('');
        });
    };

    const fieldClass =
        'w-full rounded-lg bg-background px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

    return (
        <>
            <Button
                variant='outline'
                size='sm'
                className='shrink-0 rounded-full'
                onClick={() => setOpen(true)}
            >
                <Tag className='mr-1.5 size-4' />
                {dict.admin.manageCategories}
            </Button>

            <Dialog
                open={open}
                onOpenChange={isOpen => {
                    if (!busy) setOpen(isOpen);
                }}
            >
                <DialogContent className='max-h-[90vh] w-full max-w-md overflow-y-auto bg-card p-6'>
                    <DialogHeader>
                        <DialogTitle>{dict.admin.manageCategories}</DialogTitle>
                    </DialogHeader>

                    <ul className='space-y-2'>
                        {categories.map(category => {
                            const editing = editingId === category.id;
                            const confirming = confirmId === category.id;
                            return (
                                <li
                                    key={category.id}
                                    className='rounded-xl bg-muted/60 px-3 py-2'
                                >
                                    {editing ? (
                                        <div className='flex items-center gap-2'>
                                            <input
                                                value={editName}
                                                onChange={e =>
                                                    setEditName(e.target.value)
                                                }
                                                placeholder={dict.admin.nameEn}
                                                className={fieldClass}
                                            />
                                            <input
                                                value={editNameIt}
                                                onChange={e =>
                                                    setEditNameIt(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={dict.admin.nameIt}
                                                className={fieldClass}
                                            />
                                            <button
                                                type='button'
                                                aria-label={dict.admin.save}
                                                disabled={busy}
                                                onClick={() =>
                                                    onSaveEdit(category.id)
                                                }
                                                className='text-success hover:text-foreground'
                                            >
                                                <Check className='size-4' />
                                            </button>
                                            <button
                                                type='button'
                                                aria-label={dict.admin.cancel}
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                                className='text-muted-foreground hover:text-foreground'
                                            >
                                                <X className='size-4' />
                                            </button>
                                        </div>
                                    ) : confirming ? (
                                        <div className='flex items-center justify-between gap-2'>
                                            <span className='text-sm font-medium text-destructive'>
                                                {dict.admin.deleteCategoryConfirm}
                                            </span>
                                            <span className='flex shrink-0 gap-2'>
                                                <Button
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() =>
                                                        setConfirmId(null)
                                                    }
                                                    disabled={busy}
                                                >
                                                    {dict.admin.cancel}
                                                </Button>
                                                <Button
                                                    variant='destructive'
                                                    size='sm'
                                                    onClick={() =>
                                                        onDelete(category.id)
                                                    }
                                                    disabled={busy}
                                                >
                                                    {dict.admin.delete}
                                                </Button>
                                            </span>
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-between gap-2'>
                                            <span className='flex min-w-0 items-center gap-2'>
                                                <span className='truncate text-sm font-medium'>
                                                    {localizeName(
                                                        category,
                                                        locale
                                                    )}
                                                </span>
                                                {category.productCount > 0 && (
                                                    <span className='shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground'>
                                                        {category.productCount}
                                                    </span>
                                                )}
                                            </span>
                                            <span className='flex shrink-0 gap-3'>
                                                <button
                                                    type='button'
                                                    aria-label={dict.admin.edit}
                                                    onClick={() =>
                                                        startEdit(category)
                                                    }
                                                    className='text-muted-foreground hover:text-foreground'
                                                >
                                                    <Pencil className='size-4' />
                                                </button>
                                                <button
                                                    type='button'
                                                    aria-label={
                                                        dict.admin.delete
                                                    }
                                                    disabled={
                                                        category.productCount > 0
                                                    }
                                                    title={
                                                        category.productCount > 0
                                                            ? dict.admin
                                                                  .categoryNotEmpty
                                                            : undefined
                                                    }
                                                    onClick={() =>
                                                        setConfirmId(
                                                            category.id
                                                        )
                                                    }
                                                    className='text-destructive transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-destructive'
                                                >
                                                    <Trash2 className='size-4' />
                                                </button>
                                            </span>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    <form
                        onSubmit={onAdd}
                        className='mt-4 flex flex-col gap-2 border-t border-border pt-4'
                    >
                        <div className='flex gap-2'>
                            <input
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder={dict.admin.nameEn}
                                className={fieldClass}
                            />
                            <input
                                value={newNameIt}
                                onChange={e => setNewNameIt(e.target.value)}
                                placeholder={dict.admin.nameIt}
                                className={fieldClass}
                            />
                        </div>
                        <Button
                            type='submit'
                            size='sm'
                            className='self-end rounded-full'
                            disabled={busy}
                        >
                            {dict.admin.addCategory}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
