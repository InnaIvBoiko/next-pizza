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
import { Filters } from './filters';

interface Props {
    className?: string;
}

/**
 * Mobile-only entry point for the menu filters: a trigger button that opens the
 * full <Filters /> in a left drawer. On lg+ the inline sidebar is used instead.
 */
export const FiltersDrawer: React.FC<Props> = ({ className }) => {
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
                        Filtri
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side='left'
                    className='scrollbar w-[88vw] overflow-y-auto'
                >
                    <SheetHeader>
                        <SheetTitle className='text-lg font-bold'>
                            Filtri
                        </SheetTitle>
                    </SheetHeader>
                    <div className='px-4 pb-8'>
                        <Filters />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};
