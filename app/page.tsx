import { Container, Filters, Title, TopBar } from '@/components/shared';

export default function Home() {
    return (
        <>
            <Container className='mt-10'>
                <Title text='All pizzas' size='lg' className='font-extrabold' />
            </Container>

            <TopBar />
            <Container className='mt-10 flex pb-14'>
                <div className='flex flex-col gap-15'>
                    <div className='w-62.5'>
                        <Filters />
                    </div>
                </div>

                <div className='flex-1'>
                    <div className='flex flex-col gap-16'>Pizza List</div>
                    {/* <PizzaList /> */}
                </div>
            </Container>
        </>
    );
}
