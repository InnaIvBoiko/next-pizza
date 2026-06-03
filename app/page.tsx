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
                                categoryId={1}
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
                                    {
                                        id: 4,
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
                            <ProductsGroupList
                                title='Combos'
                                categoryId={2}
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
                                ]}
                            />
                            <ProductsGroupList
                                title='Appetizers'
                                categoryId={3}
                                items={[]}
                            />
                            <ProductsGroupList
                                title='Cocktails'
                                categoryId={4}
                                items={[]}
                            />
                            <ProductsGroupList
                                title='Coffee'
                                categoryId={5}
                                items={[]}
                            />
                            <ProductsGroupList
                                title='Beverages'
                                categoryId={6}
                                items={[]}
                            />
                            <ProductsGroupList
                                title='Desserts'
                                categoryId={7}
                                items={[
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
                                    {
                                        id: 4,
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
                                    {
                                        id: 5,
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
                        </div>
                        {/* <PizzaList /> */}
                    </div>
                </div>
            </Container>
        </>
    );
}
