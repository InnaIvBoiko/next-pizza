import { Container, Filters, Title, TopBar } from '@/components/shared';
import { ProductsGroupList } from '@/components/shared/products-group-list';

export default function Home() {
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
                            <ProductsGroupList
                                title='Pizzas'
                                items={[
                                    {
                                        id: 1,
                                        name: 'Margherita',
                                        imageUrl: '/images/margherita.png',
                                        description:
                                            'Classic Margherita pizza with fresh basil and mozzarella. Ingredients: tomatoes, mozzarella cheese, fresh basil.',
                                        items: [
                                            {
                                                price: 8.99,
                                            },
                                        ],
                                    },
                                    {
                                        id: 2,
                                        name: 'Margherita',
                                        imageUrl: '/images/margherita.png',
                                        description:
                                            'Classic Margherita pizza with fresh basil and mozzarella. Ingredients: tomatoes, mozzarella cheese, fresh basil.',
                                        items: [
                                            {
                                                price: 8.99,
                                            },
                                        ],
                                    },
                                    {
                                        id: 3,
                                        name: 'Pepperoni',
                                        items: [
                                            {
                                                price: 9.99,
                                            },
                                        ],
                                        imageUrl: '/images/margherita.png',
                                        description:
                                            'Spicy pepperoni with mozzarella cheese and tomato sauce. Ingredients: tomatoes, mozzarella cheese, pepperoni.',
                                    },
                                ]}
                            />
                            <ProductsGroupList title='Combos' items={[]} />
                            <ProductsGroupList title='Desserts' items={[]} />
                        </div>
                        {/* <PizzaList /> */}
                    </div>
                </div>
            </Container>
        </>
    );
}
