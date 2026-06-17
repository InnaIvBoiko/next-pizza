import { Container, Filters, FiltersDrawer, TopBar } from '@/shared/components';
import { ProductsGroupList } from '@/shared/components/shared/products-group-list';
import { prisma } from '@/prisma/prisma-client';
import { getDictionary } from '../../dictionaries';
import type { Locale } from '@/shared/constants/i18n';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Next Pizza | Menu',
};

// Render on each request: the menu comes from the database, which is not
// reachable at build time (e.g. on Vercel). Avoids build-time prerendering.
export const dynamic = 'force-dynamic';

interface MenuProps {
    params: Promise<{ lang: string }>;
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

export default async function Menu({ params, searchParams }: MenuProps) {
    const { lang } = await params;
    const filters = await searchParams;
    const dict = await getDictionary(lang as Locale);

    const ingredientIds = toNumberList(filters.ingredients);
    const sizes = toNumberList(filters.sizes);
    const pizzaTypes = toNumberList(filters.pizzaTypes);
    const priceFrom = Number(filters.priceFrom) || undefined;
    const priceTo = Number(filters.priceTo) || undefined;

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
            <section className='glow-warm'>
                <Container className='px-4 pt-8 pb-6 sm:pt-12'>
                    <span className='text-sm font-semibold tracking-wide text-primary uppercase'>
                        {dict.menuPage.label}
                    </span>
                    <h1 className='mt-2 text-4xl font-extrabold text-balance sm:text-5xl'>
                        {dict.menuPage.title}
                    </h1>
                    <p className='mt-3 max-w-xl text-muted-foreground'>
                        {dict.menuPage.description}
                    </p>
                </Container>
            </section>

            <TopBar
                categories={visibleCategories.map(({ id, name }) => ({
                    id,
                    name,
                }))}
            />

            <Container className='mt-6 px-4 pb-14 sm:mt-10'>
                <div className='flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-16'>
                    <aside className='w-full lg:w-72 lg:shrink-0'>
                        {/* Mobile: filters open in a drawer */}
                        <FiltersDrawer />

                        {/* Desktop: sticky glass sidebar */}
                        <div className='glass scrollbar hidden rounded-3xl p-5 lg:sticky lg:top-32 lg:block lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto'>
                            <Filters />
                        </div>
                    </aside>

                    <div className='flex-1'>
                        <div className='flex flex-col gap-12 sm:gap-16'>
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
