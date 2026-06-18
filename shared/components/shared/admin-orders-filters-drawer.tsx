'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
    Button,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '../ui';
import { AdminOrdersFilters } from './admin-orders-filters';
import { useDictionary } from './i18n/dictionary-provider';

interface Props {
    className?: string;
}

/** Mobile-only entry point for the admin order filters (left drawer). */
export const AdminOrdersFiltersDrawer: React.FC<Props> = ({ className }) => {
    const dict = useDictionary();

    return (
        <div className={cn('lg:hidden', className)}>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant='outline'
                        className='w-full rounded-full'
                        size='lg'
                    >
                        <SlidersHorizontal className='mr-2 size-4' />
                        {dict.filters.title}
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side='left'
                    className='scrollbar w-[88vw] overflow-y-auto'
                >
                    <SheetHeader>
                        <SheetTitle className='text-lg font-bold'>
                            {dict.filters.title}
                        </SheetTitle>
                    </SheetHeader>
                    <div className='px-4 pb-8'>
                        <AdminOrdersFilters />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};
