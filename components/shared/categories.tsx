import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface CategoriesProps {
    className?: string;
}

const cats = [
    'Pizzas',
    'Combos',
    'Appetizers',
    'Cocktails',
    'Coffee',
    'Beverages',
    'Desserts',
    'Desserts',
];

const activeIndex = 0;

export const Categories = ({ className }: CategoriesProps) => {
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
                    href={`#${cat}`}
                    className={cn(
                        'flex h-11 items-center rounded-2xl px-5 font-bold',
                        activeIndex === i &&
                            'text-primary bg-white shadow-md shadow-gray-200'
                    )}
                >
                    {cat}
                </Link>
            ))}
        </div>
    );
};
