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
                'inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-muted px-4 text-sm whitespace-nowrap',
                className
            )}
        >
            <ArrowUpDown size={16} />
            <b>Ordina:</b>
            <b className='text-primary'>popolari</b>
        </div>
    );
};
