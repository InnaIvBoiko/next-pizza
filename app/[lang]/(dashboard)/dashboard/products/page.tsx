import { prisma } from '@/prisma/prisma-client';
import { getAdminSession } from '@/shared/lib/get-admin-session';
import { Container } from '@/shared/components/shared/container';
import { AdminProductsManager } from '@/shared/components/shared/admin-products-manager';
import { isProductAvailable } from '@/shared/lib/is-product-available';
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

    const [products, ingredients, categories] = await Promise.all([
        prisma.product.findMany({
            include: {
                ingredients: { select: { id: true, available: true } },
                extraIngredients: { select: { id: true } },
                items: {
                    select: {
                        id: true,
                        price: true,
                        size: true,
                        pizzaType: true,
                    },
                    orderBy: { id: 'asc' },
                },
            },
            orderBy: { id: 'asc' },
        }),
        prisma.ingredient.findMany({ orderBy: { name: 'asc' } }),
        prisma.category.findMany({
            orderBy: { id: 'asc' },
            include: { _count: { select: { products: true } } },
        }),
    ]);

    const ingredientList = ingredients.map(ingredient => ({
        id: ingredient.id,
        name: localizeName(ingredient, lang as Locale),
    }));

    const categoryList = categories.map(category => ({
        id: category.id,
        name: category.name,
        nameIt: category.nameIt,
        productCount: category._count.products,
    }));

    const productList = products.map(product => ({
        id: product.id,
        name: product.name,
        nameIt: product.nameIt,
        description: product.description,
        descriptionIt: product.descriptionIt,
        imageUrl: product.imageUrl,
        available: product.available,
        effectiveAvailable: isProductAvailable(product),
        categoryId: product.categoryId,
        includedIds: product.ingredients.map(i => i.id),
        extraIds: product.extraIngredients.map(i => i.id),
        items: product.items.map(item => ({
            id: item.id,
            price: item.price,
            size: item.size,
            pizzaType: item.pizzaType,
        })),
    }));

    return (
        <Container className='px-4'>
            <h1 className='text-3xl font-extrabold'>{dict.admin.productsNav}</h1>

            <div className='mt-6'>
                <AdminProductsManager
                    products={productList}
                    categories={categoryList}
                    ingredients={ingredientList}
                />
            </div>
        </Container>
    );
}
