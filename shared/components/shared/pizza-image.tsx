import React from 'react';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';

interface Props {
    className?: string;
    imageUrl: string;
    size: 20 | 30 | 40;
}

const sizePx: Record<Props['size'], number> = { 20: 300, 30: 400, 40: 500 };

export const PizzaImage: React.FC<Props> = ({ imageUrl, size, className }) => {
    return (
        <div
            className={cn(
                'relative flex w-full flex-1 items-center justify-center',
                className
            )}
        >
            <Image
                src={imageUrl}
                alt='Logo'
                width={sizePx[size]}
                height={sizePx[size]}
                className={cn(
                    'relative top-2 left-2 z-10 transition-all duration-300',
                    {
                        'h-75 w-75': Number(size) === 20,
                        'h-100 w-100': Number(size) === 30,
                        'h-125 w-125': Number(size) === 40,
                    }
                )}
            />

            <div className='absolute top-1/2 left-1/2 h-112.5 w-112.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-gray-200' />
            <div className='absolute top-1/2 left-1/2 h-92.5 w-92.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dotted border-gray-100' />
        </div>
    );
};
