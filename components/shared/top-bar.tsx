import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Categories } from './categories';
import { SortPopup } from './sort-popup';
import { Container } from './container';

export interface TopBarProps {
    className?: string;
}

export const TopBar = ({ className }: TopBarProps) => {
    return (
        <div
            className={cn(
                'sticky top-0 z-10 bg-white py-5 shadow-lg shadow-black/5',
                className
            )}
        >
            <Container className='flex items-center justify-between'>
                <Categories />
                <SortPopup />
            </Container>
        </div>
    );
};
