import React from 'react';
import { cn } from '@/shared/lib/utils';
import { formatPrice } from '@/shared/lib';
import Image from 'next/image';
import { CountButton } from './';

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
                <div className='relative h-16.25 w-16.25 shrink-0'>
                    <Image
                        className='object-cover'
                        src={imageUrl}
                        fill
                        sizes='65px'
                        alt={name ?? 'Pizza'}
                    />
                </div>
            )}

            <div>
                <h2 className='text-lg font-bold'>{name}</h2>
                <p className='text-sm text-gray-400'>
                    Medium 30 cm, traditional dough
                </p>
                <hr className='my-3' />

                <div className='flex items-center justify-between'>
                    <CountButton value={count} />

                    <h2 className='font-bold'>
                        {price !== undefined ? formatPrice(price) : null}
                    </h2>
                </div>
            </div>
        </div>
    );
};
