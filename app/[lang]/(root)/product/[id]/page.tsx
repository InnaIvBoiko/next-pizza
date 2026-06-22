import { cache } from 'react';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';
import { Container } from '@/shared/components/shared/container';
import { ProductForm } from '@/shared/components/shared/product-form';
import type { Metadata } from 'next';

const getProduct = cache((id: number) =>
    prisma.product.findFirst({
        where: { id },
        include: {
            ingredients: true,
            extraIngredients: true,
            category: {
                include: {
                    products: {
                        include: {
                            items: true,
                        },
                    },
                },
            },
            items: true,
        },
    })
);

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(Number(id));

    if (!product) {
        return { title: 'Next Pizza' };
    }

    return {
        title: `Next Pizza | ${product.name}`,
        description: product.description ?? undefined,
        openGraph: {
            title: product.name,
            description: product.description ?? undefined,
            images: product.imageUrl ? [{ url: product.imageUrl }] : [],
        },
    };
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = await getProduct(Number(id));

    if (!product) {
        return notFound();
    }

    return (
        <Container className='my-10 flex flex-col'>
            <ProductForm product={product} />
        </Container>
    );
}
