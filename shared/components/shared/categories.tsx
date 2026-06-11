'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { useCategoryStore } from '@/shared/store/category';

interface Category {
    id: number;
    name: string;
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
                'inline-flex gap-1 rounded-2xl bg-gray-50 p-1',
                className
            )}
        >
            {items.map(cat => (
                <Link
                    key={cat.id}
                    href={`#${cat.name}`}
                    className={cn(
                        'flex h-11 items-center rounded-2xl px-5 font-bold',
                        activeCategoryId === cat.id &&
                            'text-primary bg-white shadow-md shadow-gray-200'
                    )}
                >
                    {cat.name}
                </Link>
            ))}
        </div>
    );
};
