import { Container, Filters, Title, TopBar } from '@/shared/components';
import { ProductsGroupList } from '@/shared/components/shared/products-group-list';
import { prisma } from '@/prisma/prisma-client';

// Render on each request: the menu comes from the database, which is not
// reachable at build time (e.g. on Vercel). Avoids build-time prerendering.
export const dynamic = 'force-dynamic';

interface HomeProps {
    searchParams: Promise<{
        ingredients?: string;
        sizes?: string;
        pizzaTypes?: string;
        priceFrom?: string;
        priceTo?: string;
    }>;
}

// "2,8,6" -> [2, 8, 6] (drops anything non-numeric)
const toNumberList = (value?: string) =>
    value
        ?.split(',')
        .map(Number)
        .filter(n => !Number.isNaN(n));

export default async function Home({ searchParams }: HomeProps) {
    const params = await searchParams;

    const ingredientIds = toNumberList(params.ingredients);
    const sizes = toNumberList(params.sizes);
    const pizzaTypes = toNumberList(params.pizzaTypes);
    const priceFrom = Number(params.priceFrom) || undefined;
    const priceTo = Number(params.priceTo) || undefined;

    // Constraints on a product's variants (ProductItem): size, dough type, price.
    const itemsWhere = {
        ...(sizes?.length ? { size: { in: sizes } } : {}),
        ...(pizzaTypes?.length ? { pizzaType: { in: pizzaTypes } } : {}),
        ...(priceFrom || priceTo
            ? { price: { gte: priceFrom, lte: priceTo } }
            : {}),
    };

    const productsWhere = {
        ...(ingredientIds?.length
            ? { ingredients: { some: { id: { in: ingredientIds } } } }
            : {}),
        // Only constrain variants when at least one variant filter is set,
        // so products without items aren't accidentally excluded.
        ...(Object.keys(itemsWhere).length ? { items: { some: itemsWhere } } : {}),
    };

    const categories = await prisma.category.findMany({
        include: {
            products: {
                where: Object.keys(productsWhere).length
                    ? productsWhere
                    : undefined,
                include: {
                    ingredients: true,
                    items: true,
                },
            },
        },
        orderBy: { id: 'asc' },
    });

    // Only categories that still have products after filtering — drives both
    // the menu groups and the TopBar tabs, so a size/type filter that leaves
    // only pizzas hides every other category's tab too.
    const visibleCategories = categories.filter(
        category => category.products.length > 0
    );

    return (
        <>
            <Container className='mt-10'>
                <Title text='All pizzas' size='lg' className='font-extrabold' />
            </Container>

            <TopBar
                categories={visibleCategories.map(({ id, name }) => ({
                    id,
                    name,
                }))}
            />
            <Container className='mt-10 flex pb-14'>
                <div className='flex gap-20'>
                    <div className='w-62.5'>
                        <Filters />
                    </div>

                    <div className='flex-1'>
                        <div className='flex flex-col gap-16'>
                            {visibleCategories.map(category => (
                                <ProductsGroupList
                                    key={category.id}
                                    title={category.name}
                                    categoryId={category.id}
                                    items={category.products}
                                    priority={category.id === 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}
