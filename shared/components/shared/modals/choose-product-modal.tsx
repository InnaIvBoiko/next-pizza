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
// import { useCartStore } from '@/shared/store';
// import toast from 'react-hot-toast';

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
                    'min-h-125 w-265 max-w-265 sm:max-w-265 overflow-hidden bg-white p-0',
                    className
                )}
            >
                <DialogTitle className='sr-only'>{product.name}</DialogTitle>
                <DialogDescription className='sr-only'>
                    Choose options for {product.name}
                </DialogDescription>
                <ProductForm product={product} onSubmit={() => router.back()} />
            </DialogContent>
        </Dialog>
    );
};
