'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { ProductWithRelations } from '@/@types/prisma';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { ProductForm } from '../product-form';

interface Props {
    product: ProductWithRelations;
    className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
    const router = useRouter();

    return (
        <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
            <DialogContent
                className={cn(
                    'max-h-[92vh] w-full max-w-[calc(100%-1.5rem)] overflow-y-auto bg-card p-0 sm:max-w-md lg:min-h-125 lg:max-w-265 lg:overflow-hidden',
                    className
                )}
            >
                <DialogTitle className='sr-only'>{product.name}</DialogTitle>
                <DialogDescription className='sr-only'>
                    Scegli le opzioni per {product.name}
                </DialogDescription>
                <ProductForm product={product} onSubmit={() => router.back()} />
            </DialogContent>
        </Dialog>
    );
};
