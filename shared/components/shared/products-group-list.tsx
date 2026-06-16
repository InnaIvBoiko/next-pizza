'use client';

import React from 'react';
import { useIntersection } from 'react-use';
import { cn } from '@/shared/lib/utils';
import { ProductCard } from './product-card';
import { Title } from './title';
import { useCategoryStore } from '@/shared/store/category';

export interface ProductsGroupListProps {
    title: string;
    items: Array<{
        id: number;
        name: string;
        imageUrl: string;
        description?: string;
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
    items,
    className,
    listClassName,
    categoryId,
    priority = false,
}: ProductsGroupListProps) => {
    const setActiveCategoryId = useCategoryStore(state => state.setActiveId);

    const intersectionRef = React.useRef<HTMLDivElement | null>(null);
    const intersection = useIntersection(
        intersectionRef as React.RefObject<HTMLDivElement>,
        {
            threshold: 0.4,
        }
    );

    React.useEffect(() => {
        if (intersection?.isIntersecting) {
            setActiveCategoryId(categoryId);
        }
    }, [categoryId, intersection?.isIntersecting, title, setActiveCategoryId]);

    return (
        <div className={className} id={title} ref={intersectionRef}>
            <Title text={title} size='lg' className='mb-5 font-extrabold' />

            <div className={cn('grid grid-cols-3 gap-12.5', listClassName)}>
                {items.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        imageUrl={product.imageUrl}
                        price={product.items[0].price}
                        description={product.description}
                        priority={priority && index === 0}
                    />
                ))}
            </div>
        </div>
    );
};
