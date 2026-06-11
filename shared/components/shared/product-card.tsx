import React from 'react';
import { cn } from '@/shared/lib/utils';
import { formatPrice } from '@/shared/lib';
import Link from 'next/link';
import Image from 'next/image';
import { Title } from './title';
import { Button } from '../ui';
import { Plus } from 'lucide-react';

export interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
    priority?: boolean;
    className?: string;
}

export const ProductCard = ({
    id,
    name,
    price,
    imageUrl,
    description,
    priority = false,
    className,
}: ProductCardProps) => {
    return (
        <div className={cn(className)}>
            <Link href={`/product/${id}`}>
                <div className='bg-secondary flex h-65 justify-center rounded-lg p-6'>
                    {/* fill (not width/height) so arbitrary-ratio product
                        photos sit in the fixed square box without tripping
                        Next's aspect-ratio warning; object-contain keeps them
                        undistorted. */}
                    <div className='relative h-53.75 w-53.75'>
                        <Image
                            className='object-contain'
                            src={imageUrl}
                            alt={name}
                            fill
                            sizes='215px'
                            priority={priority}
                        />
                    </div>
                </div>
                <Title text={name} size='sm' className='mt-3 mb-1 font-bold' />
                {description && (
                    <p className='text-sm text-gray-400'>{description}</p>
                )}
                <div className='mt-4 flex items-start justify-between'>
                    <span className='text-[20px]'>
                        from <b>{formatPrice(price)}</b>
                    </span>
                    <Button variant='secondary'>
                        <Plus size={20} className='mr-1' />
                        Add to Cart
                    </Button>
                </div>
            </Link>
        </div>
    );
};
