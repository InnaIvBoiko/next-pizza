import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';
import { Container } from '@/shared/components/shared/container';
import { ProductForm } from '@/shared/components/shared/product-form';

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = await prisma.product.findFirst({
        where: { id: Number(id) },
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
    });

    if (!product) {
        return notFound();
    }

    return (
        <Container className='my-10 flex flex-col'>
            <ProductForm product={product} />
        </Container>
    );
}
