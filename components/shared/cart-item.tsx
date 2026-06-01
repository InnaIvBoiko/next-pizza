import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { CountButton } from './count-button';

interface Props {
    imageUrl?: string;
    name?: string;
    price?: number;
    className?: string;
    count?: number;
}

export const CartItem: React.FC<Props> = ({
    imageUrl,
    name,
    price,
    count,
    className,
}) => {
    return (
        <div className={cn('flex h-36 gap-6 bg-white p-5', className)}>
            {imageUrl && (
                <Image
                    className='h-16.25 w-16.25'
                    src={imageUrl}
                    width={65}
                    height={65}
                    alt={name ?? 'Pizza'}
                />
            )}

            <div>
                <h2 className='text-lg font-bold'>{name}</h2>
                <p className='text-sm text-gray-400'>
                    Средняя 30 см, традиционное тесто
                </p>
                <hr className='my-3' />

                <div className='flex items-center justify-between'>
                    <CountButton value={count} />

                    <h2 className='font-bold'>{price} ₽</h2>
                </div>
            </div>
        </div>
    );
};
