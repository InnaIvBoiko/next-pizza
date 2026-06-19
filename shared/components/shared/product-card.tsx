'use client';

import { cn } from '@/shared/lib/utils';
import { formatPrice } from '@/shared/lib';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/shared/constants/images';
import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useDictionary, useLocalizeHref } from './i18n/dictionary-provider';

export interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description?: string | null;
    /** False when an included ingredient is out of stock — card is not orderable. */
    available?: boolean;
    priority?: boolean;
    className?: string;
}

export const ProductCard = ({
    id,
    name,
    price,
    imageUrl,
    description,
    available = true,
    priority = false,
    className,
}: ProductCardProps) => {
    const dict = useDictionary();
    const localize = useLocalizeHref();

    const inner = (
        <>
            {/* Photo box: fixed square, fill + object-contain keeps arbitrary
                ratios undistorted and avoids Next's aspect-ratio warning. */}
            <div className='relative aspect-square overflow-hidden rounded-2xl bg-secondary'>
                <div className='glow-warm absolute inset-0' />
                <Image
                    className={cn(
                        'object-contain p-4 transition-transform duration-500',
                        available
                            ? 'group-hover:scale-105'
                            : 'opacity-60 grayscale'
                    )}
                    src={imageUrl || PRODUCT_IMAGE_PLACEHOLDER}
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

                <div className='mt-auto flex items-center justify-between gap-2 pt-4'>
                    {available ? (
                        <>
                            <span className='whitespace-nowrap text-sm text-muted-foreground'>
                                {dict.product.from}{' '}
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
                        </>
                    ) : (
                        <span className='rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground'>
                            {dict.product.unavailable}
                        </span>
                    )}
                </div>
            </div>
        </>
    );

    // Out of stock: render a non-interactive card (no link) so it can't be opened.
    if (!available) {
        return (
            <div
                aria-disabled
                className={cn(
                    'flex cursor-not-allowed flex-col rounded-3xl border border-border bg-card p-3 opacity-70',
                    className
                )}
            >
                {inner}
            </div>
        );
    }

    return (
        <Link
            href={localize(`/product/${id}`)}
            className={cn(
                'group flex flex-col rounded-3xl border border-border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-foreground/5',
                className
            )}
        >
            {inner}
        </Link>
    );
};
