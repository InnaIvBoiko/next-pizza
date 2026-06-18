'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/components/ui/popover';
import { useDictionary } from '@/shared/components/shared/i18n/dictionary-provider';
import {
    sortOptions,
    defaultSort,
    parseSort,
    type SortOption,
} from '@/shared/constants/sort';

export interface SortPopupProps {
    className?: string;
}

export const SortPopup = ({ className }: SortPopupProps) => {
    const dict = useDictionary();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = React.useState(false);

    const active = parseSort(searchParams.get('sort'));

    const handleSelect = (option: SortOption) => {
        // Merge into the current query so the active filters survive a sort
        // change. `popular` is the natural order, so it's kept out of the URL.
        const params = new URLSearchParams(searchParams.toString());
        if (option === defaultSort) {
            params.delete('sort');
        } else {
            params.set('sort', option);
        }

        const query = params.toString();
        router.replace(query ? `?${query}` : '?', { scroll: false });
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                className={cn(
                    'inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-muted px-4 text-sm whitespace-nowrap',
                    className
                )}
            >
                <ArrowUpDown size={16} />
                <b>{dict.sort.label}</b>
                <b className='text-primary'>{dict.sort.options[active]}</b>
            </PopoverTrigger>

            <PopoverContent align='end' className='w-56 p-1.5'>
                {sortOptions.map(option => (
                    <button
                        key={option}
                        type='button'
                        onClick={() => handleSelect(option)}
                        className={cn(
                            'flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted',
                            option === active && 'font-medium text-primary'
                        )}
                    >
                        {dict.sort.options[option]}
                        {option === active && <Check size={16} />}
                    </button>
                ))}
            </PopoverContent>
        </Popover>
    );
};
