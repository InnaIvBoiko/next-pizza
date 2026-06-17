import React from 'react';
import { cn } from '@/shared/lib/utils';
import { formatPrice } from '@/shared/lib';
import Link from 'next/link';
import Image from 'next/image';
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
        <Link
            href={`/product/${id}`}
            className={cn(
                'group flex flex-col rounded-3xl border border-border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-foreground/5',
                className
            )}
        >
            {/* Photo box: fixed square, fill + object-contain keeps arbitrary
                ratios undistorted and avoids Next's aspect-ratio warning. */}
            <div className='relative aspect-square overflow-hidden rounded-2xl bg-secondary'>
                <div className='glow-warm absolute inset-0' />
                <Image
                    className='object-contain p-4 transition-transform duration-500 group-hover:scale-105'
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes='(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 300px'
                    priority={priority}
                />
            </div>

            <div className='flex flex-1 flex-col px-2 pt-4 pb-1'>
                <h3 className='text-lg leading-tight font-bold'>{name}</h3>
                {description && (
                    <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
                        {description}
                    </p>
                )}

                <div className='mt-4 flex items-center justify-between gap-2'>
                    <span className='text-sm text-muted-foreground'>
                        da{' '}
                        <b className='text-xl text-foreground'>
                            {formatPrice(price)}
                        </b>
                    </span>
                    <span
                        aria-hidden
                        className='inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-110 group-active:scale-95'
                    >
                        <Plus size={20} />
                    </span>
                </div>
            </div>
        </Link>
    );
};
