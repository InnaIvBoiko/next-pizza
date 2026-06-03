'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useCategoryStore } from '@/store/category';

export interface CategoriesProps {
    className?: string;
}

const cats = [
    { name: 'Pizzas', id: 1 },
    { name: 'Combos', id: 2 },
    { name: 'Appetizers', id: 3 },
    { name: 'Cocktails', id: 4 },
    { name: 'Coffee', id: 5 },
    { name: 'Beverages', id: 6 },
    { name: 'Desserts', id: 7 },
];

export const Categories = ({ className }: CategoriesProps) => {
    const activeCategoryId = useCategoryStore(state => state.activeId);

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-2xl bg-gray-50 p-1',
                className
            )}
        >
            {cats.map((cat, i) => (
                <Link
                    key={i}
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
