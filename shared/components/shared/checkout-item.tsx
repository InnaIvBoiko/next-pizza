'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import * as CartItemDetails from './cart-item-details';

interface Props extends CartItemProps {
    onClickCountButton?: (type: 'plus' | 'minus') => void;
    onClickRemove?: () => void;
    className?: string;
}

export const CheckoutItem: React.FC<Props> = ({
    name,
    price,
    imageUrl,
    quantity,
    details,
    className,
    disabled,
    onClickCountButton,
    onClickRemove,
}) => {
    return (
        <div
            className={cn(
                'flex items-center justify-between',
                {
                    'pointer-events-none opacity-50': disabled,
                },
                className
            )}
        >
            <div className='flex flex-1 items-center gap-5'>
                <CartItemDetails.Image src={imageUrl} />
                <CartItemDetails.Info name={name} details={details} />
            </div>

            <CartItemDetails.Price value={price} />

            <div className='ml-20 flex items-center gap-5'>
                <CartItemDetails.CountButton
                    onClick={onClickCountButton}
                    value={quantity}
                />
                <button type='button' onClick={onClickRemove}>
                    <X
                        className='cursor-pointer text-muted-foreground hover:text-foreground'
                        size={20}
                    />
                </button>
            </div>
        </div>
    );
};
