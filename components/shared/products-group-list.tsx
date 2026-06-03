import React from 'react';
import { cn } from '@/lib/utils';
import { ProductCard } from './product-card';
import { Title } from './title';

export interface ProductsGroupListProps {
    title: string;
    items: Array<{
        id: number;
        name: string;
        imageUrl: string;
        description: string;
        items: Array<{
            price: number;
        }>;
    }>;
    categoryId?: string;
    className?: string;
    listClassName?: string;
}

export const ProductsGroupList = ({
    title,
    items,
    className,
    listClassName,
}: ProductsGroupListProps) => {
    return (
        <div
            className={className}
            id={title}
            // ref={intersectionRef}
        >
            <Title text={title} size='lg' className='mb-5 font-extrabold' />

            <div className={cn('grid grid-cols-3 gap-12.5', listClassName)}>
                {items.map(product => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        imageUrl={product.imageUrl}
                        price={product.items[0].price}
                        description={product.description}
                    />
                ))}
            </div>
        </div>
    );
};
