import { Container, Filters, Title, TopBar } from '@/shared/components';
import { ProductsGroupList } from '@/shared/components/shared/products-group-list';
import { prisma } from '@/prisma/prisma-client';

// Render on each request: the menu comes from the database, which is not
// reachable at build time (e.g. on Vercel). Avoids build-time prerendering.
export const dynamic = 'force-dynamic';

export default async function Home() {
    const categories = await prisma.category.findMany({
        include: {
            products: {
                include: {
                    ingredients: true,
                    items: true,
                },
            },
        },
        orderBy: { id: 'asc' },
    });

    return (
        <>
            <Container className='mt-10'>
                <Title text='All pizzas' size='lg' className='font-extrabold' />
            </Container>

            <TopBar />
            <Container className='mt-10 flex pb-14'>
                <div className='flex gap-20'>
                    <div className='w-62.5'>
                        <Filters />
                    </div>

                    <div className='flex-1'>
                        <div className='flex flex-col gap-16'>
                            {categories
                                .filter(
                                    category => category.products.length > 0
                                )
                                .map(category => (
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
