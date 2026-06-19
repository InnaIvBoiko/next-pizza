import React from 'react';
import { cn } from '@/shared/lib/utils';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/shared/constants/images';
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
                'relative flex w-full flex-1 items-center justify-center py-6 lg:py-0',
                className
            )}
        >
            <Image
                src={imageUrl || PRODUCT_IMAGE_PLACEHOLDER}
                alt='Logo'
                width={sizePx[size]}
                height={sizePx[size]}
                className={cn(
                    'relative top-2 left-2 z-10 transition-all duration-300',
                    {
                        'h-44 w-44 lg:h-75 lg:w-75': Number(size) === 20,
                        'h-52 w-52 lg:h-100 lg:w-100': Number(size) === 30,
                        'h-60 w-60 lg:h-125 lg:w-125': Number(size) === 40,
                    }
                )}
            />

            <div className='absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-border lg:h-112.5 lg:w-112.5' />
            <div className='absolute top-1/2 left-1/2 h-50 w-50 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dotted border-border lg:h-92.5 lg:w-92.5' />
        </div>
    );
};
