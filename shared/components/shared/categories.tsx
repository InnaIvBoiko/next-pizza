'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { useCategoryStore } from '@/shared/store/category';

interface Category {
    id: number;
    /** Locale-independent anchor key (matches the section id). */
    name: string;
    /** Localized label shown to the user. */
    label: string;
}

export interface CategoriesProps {
    items: Category[];
    className?: string;
}

export const Categories = ({ items, className }: CategoriesProps) => {
    const activeId = useCategoryStore(state => state.activeId);
    // Before any scroll sets an active category (activeId === 0), highlight the
    // first one. Also falls back when the active category gets filtered out.
    const activeCategoryId =
        items.some(cat => cat.id === activeId) ? activeId : items[0]?.id;

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-full bg-muted p-1',
                className
            )}
        >
            {items.map(cat => (
                <Link
                    key={cat.id}
                    href={`#${cat.name}`}
                    className={cn(
                        'flex h-10 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground',
                        activeCategoryId === cat.id &&
                            'bg-background text-primary shadow-sm'
                    )}
                >
                    {cat.label}
                </Link>
            ))}
        </div>
    );
};
