'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { formatPrice } from '@/shared/lib';
import { CircleCheck } from 'lucide-react';
import { ImageWithFallback } from './image-with-fallback';

interface Props {
    imageUrl: string;
    name: string;
    price: number;
    active?: boolean;
    disabled?: boolean;
    /** Shown in place of the price when the ingredient is out of stock. */
    unavailableLabel?: string;
    /** Shown in place of the price (e.g. "Included" for base ingredients). */
    priceLabel?: string;
    onClick?: () => void;
    className?: string;
}

export const IngredientItem: React.FC<Props> = ({
    className,
    active,
    disabled,
    unavailableLabel,
    priceLabel,
    price,
    name,
    imageUrl,
    onClick,
}) => {
    return (
        <div
            className={cn(
                'relative flex w-32 flex-col items-center rounded-md bg-card p-1 text-center shadow-md',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                { 'border-primary border': active && !disabled },
                className
            )}
            onClick={disabled ? undefined : onClick}
        >
            {active && !disabled && (
                <CircleCheck className='text-primary absolute top-2 right-2' />
            )}
            <ImageWithFallback width={110} height={110} src={imageUrl} alt={name} />
            <span className='mb-1 text-xs'>{name}</span>
            {disabled && unavailableLabel ? (
                <span className='text-xs font-semibold text-destructive'>
                    {unavailableLabel}
                </span>
            ) : priceLabel ? (
                <span className='text-xs font-semibold text-muted-foreground'>
                    {priceLabel}
                </span>
            ) : (
                <span className='font-bold'>{formatPrice(price)}</span>
            )}
        </div>
    );
};
