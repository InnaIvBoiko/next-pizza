import { cn } from '@/shared/lib/utils';
import React from 'react';

import * as CartItem from './cart-item-details';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import { CountButton } from './count-button';
import { Trash2Icon } from 'lucide-react';

interface Props extends CartItemProps {
    onClickCountButton?: (type: 'plus' | 'minus') => void;
    onClickRemove?: () => void;
    className?: string;
}

export const CartDrawerItem: React.FC<Props> = ({
    imageUrl,
    name,
    price,
    quantity,
    details,
    disabled,
    onClickCountButton,
    onClickRemove,
    className,
}) => {
    return (
        <div
            data-testid='cart-item'
            className={cn(
                'flex gap-6 bg-card p-5',
                {
                    'pointer-events-none opacity-50': disabled,
                },
                className
            )}
        >
            <CartItem.Image src={imageUrl} />

            <div className='flex-1'>
                <CartItem.Info name={name} details={details} />

                <hr className='my-3' />

                <div className='flex items-center justify-between'>
                    <CountButton
                        onClick={onClickCountButton}
                        value={quantity}
                    />

                    <div className='flex items-center gap-3'>
                        <CartItem.Price value={price} />
                        <Trash2Icon
                            onClick={onClickRemove}
                            className='cursor-pointer text-muted-foreground hover:text-foreground'
                            size={16}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
