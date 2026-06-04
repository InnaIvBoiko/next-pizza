import React from 'react';
import { cn } from '@/shared/lib/utils';
import { ArrowUpDown } from 'lucide-react';

export interface SortPopupProps {
    className?: string;
}

export const SortPopup = ({ className }: SortPopupProps) => {
    return (
        <div
            className={cn(
                'inline-flex h-13 cursor-pointer items-center gap-2 rounded-2xl bg-gray-50 px-5',
                className
            )}
        >
            <ArrowUpDown size={16} />
            <b>Sorting:</b>
            <b className='text-primary'>popular</b>
        </div>
    );
};
