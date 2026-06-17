'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { ArrowUpDown } from 'lucide-react';
import { useDictionary } from '@/shared/components/shared/i18n/dictionary-provider';

export interface SortPopupProps {
    className?: string;
}

export const SortPopup = ({ className }: SortPopupProps) => {
    const dict = useDictionary();

    return (
        <div
            className={cn(
                'inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-muted px-4 text-sm whitespace-nowrap',
                className
            )}
        >
            <ArrowUpDown size={16} />
            <b>{dict.sort.label}</b>
            <b className='text-primary'>{dict.sort.popular}</b>
        </div>
    );
};
