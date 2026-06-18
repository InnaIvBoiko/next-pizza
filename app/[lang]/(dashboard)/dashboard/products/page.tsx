import Image from 'next/image';

import { prisma } from '@/prisma/prisma-client';
import { getAdminSession } from '@/shared/lib/get-admin-session';
import { Container } from '@/shared/components/shared/container';
import { AdminProductEditor } from '@/shared/components/shared/admin-product-editor';
import { localizeName } from '@/shared/lib/i18n/localize-name';
import type { Locale } from '@/shared/constants/i18n';
import { getDictionary } from '../../../dictionaries';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function AdminProductsPage({ params }: Props) {
    await getAdminSession();

    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    const [products, ingredients] = await Promise.all([
        prisma.product.findMany({
            include: {
                ingredients: { select: { id: true } },
                extraIngredients: { select: { id: true } },
            },
            orderBy: { id: 'asc' },
        }),
        prisma.ingredient.findMany({ orderBy: { name: 'asc' } }),
    ]);

    const ingredientList = ingredients.map(ingredient => ({
        id: ingredient.id,
        name: localizeName(ingredient, lang as Locale),
    }));

    return (
        <Container className='px-4'>
            <h1 className='text-3xl font-extrabold'>{dict.admin.productsNav}</h1>

            <ul className='mt-6 space-y-3'>
                {products.map(product => (
                    <li
                        key={product.id}
                        className='glass flex items-center justify-between gap-3 rounded-2xl p-4'
                    >
                        <div className='flex min-w-0 items-center gap-3'>
                            <div className='relative size-12 shrink-0 overflow-hidden rounded-xl bg-secondary'>
                                <Image
                                    src={product.imageUrl}
                                    alt=''
                                    fill
                                    sizes='48px'
                                    className='object-contain p-1'
                                />
                            </div>
                            <div className='min-w-0'>
                                <div className='truncate font-bold'>
                                    {product.name}
                                </div>
                                {product.description && (
                                    <div className='truncate text-sm text-muted-foreground'>
                                        {product.description}
                                    </div>
                                )}
                            </div>
                        </div>

                        <AdminProductEditor
                            product={{
                                id: product.id,
                                name: product.name,
                                description: product.description,
                                imageUrl: product.imageUrl,
                                includedIds: product.ingredients.map(i => i.id),
                                extraIds: product.extraIngredients.map(
                                    i => i.id
                                ),
                            }}
                            ingredients={ingredientList}
                        />
                    </li>
                ))}
            </ul>
        </Container>
    );
}
