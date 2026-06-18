'use client';

import React from 'react';
import { useIntersection } from 'react-use';
import { cn } from '@/shared/lib/utils';
import { ProductCard } from './product-card';
import { Title } from './title';
import { useCategoryStore } from '@/shared/store/category';
import { isProductAvailable } from '@/shared/lib';

export interface ProductsGroupListProps {
    title: string;
    /** Locale-independent anchor id for the section (matches the TopBar tab). */
    anchorId: string;
    items: Array<{
        id: number;
        name: string;
        imageUrl: string;
        description?: string | null;
        ingredients: Array<{ available: boolean }>;
        items: Array<{
            price: number;
        }>;
    }>;
    categoryId: number;
    className?: string;
    listClassName?: string;
    priority?: boolean;
}

export const ProductsGroupList = ({
    title,
    anchorId,
    items,
    className,
    listClassName,
    categoryId,
    priority = false,
}: ProductsGroupListProps) => {
    const setActiveCategoryId = useCategoryStore(state => state.setActiveId);

    const intersectionRef = React.useRef<HTMLDivElement | null>(null);
    // Mark a category active when its top crosses just below the sticky header +
    // TopBar (the negative top rootMargin), so the highlighted tab matches what
    // the user actually sees below the fixed bars.
    const intersection = useIntersection(
        intersectionRef as React.RefObject<HTMLDivElement>,
        {
            rootMargin: '-180px 0px -65% 0px',
            threshold: 0,
        }
    );

    React.useEffect(() => {
        if (intersection?.isIntersecting) {
            setActiveCategoryId(categoryId);
        }
    }, [categoryId, intersection?.isIntersecting, title, setActiveCategoryId]);

    return (
        <div
            className={cn(
                'scroll-mt-[calc(var(--header-height)+5rem)]',
                className
            )}
            id={anchorId}
            ref={intersectionRef}
        >
            <div className='mb-6 flex items-center gap-3'>
                <Title text={title} size='lg' className='font-extrabold' />
                <span className='rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground'>
                    {items.length}
                </span>
            </div>

            <div
                className={cn(
                    'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3',
                    listClassName
                )}
            >
                {items.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        imageUrl={product.imageUrl}
                        price={product.items[0].price}
                        description={product.description}
                        available={isProductAvailable(product.ingredients)}
                        priority={priority && index === 0}
                    />
                ))}
            </div>
        </div>
    );
};
