import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Categories } from './categories';
import { SortPopup } from './sort-popup';
import { Container } from './container';

interface Category {
    id: number;
    name: string;
}

export interface TopBarProps {
    categories: Category[];
    className?: string;
}

export const TopBar = ({ categories, className }: TopBarProps) => {
    return (
        <div
            className={cn(
                'glass-strong sticky top-(--header-height) z-20 border-b border-border',
                className
            )}
        >
            <Container className='scrollbar flex items-center justify-between gap-4 overflow-x-auto px-4 py-3'>
                <Categories items={categories} />
                <SortPopup />
            </Container>
        </div>
    );
};
