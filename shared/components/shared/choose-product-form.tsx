'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { formatPrice } from '@/shared/lib';
import { Title } from './title';
import { Button } from '../ui';

interface Props {
    imageUrl: string;
    name: string;
    price: number;
    loading?: boolean;
    onSubmit?: VoidFunction;
    className?: string;
}

/**
 * Form for choosing a simple (non-pizza) product
 */
export const ChooseProductForm: React.FC<Props> = ({
    name,
    imageUrl,
    price,
    loading,
    onSubmit,
    className,
}) => {
    return (
        <div className={cn(className, 'flex flex-1 flex-col lg:flex-row')}>
            <div className='relative flex flex-1 items-center justify-center py-6 lg:py-0'>
                <Image
                    src={imageUrl}
                    alt={name}
                    width={350}
                    height={350}
                    className='relative top-2 left-2 z-10 h-auto w-48 transition-all duration-300 sm:w-60 lg:w-87.5'
                />
            </div>

            <div className='bg-card w-full p-5 sm:p-7 lg:w-122.5'>
                <Title text={name} size='md' className='mb-1 font-extrabold' />

                <Button
                    onClick={() => onSubmit?.()}
                    className='mt-10 h-13.75 w-full rounded-[18px] px-10 text-base'
                    disabled={loading}
                >
                    {loading
                        ? 'Aggiungo...'
                        : `Aggiungi al carrello · ${formatPrice(price)}`}
                </Button>
            </div>
        </div>
    );
};
