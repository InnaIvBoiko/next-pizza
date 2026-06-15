import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Title } from '@/shared/components/shared/title';
import { Button } from '@/shared/components/ui';

interface Props {
    searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
    const { orderId } = await searchParams;

    return (
        <div className='flex flex-col items-center justify-center gap-6 py-24 text-center'>
            <div className='text-7xl'>🎉</div>

            <Title
                text='Thank you for your order!'
                size='lg'
                className='font-extrabold'
            />

            <p className='max-w-md text-lg text-gray-400'>
                {orderId
                    ? `Your payment was successful and order #${orderId} is confirmed. We'll start preparing it right away.`
                    : 'Your payment was successful and your order is confirmed.'}
            </p>

            <Link href='/'>
                <Button className='mt-4 h-12 gap-2 px-6 text-base'>
                    <ArrowLeft className='w-5' />
                    Back to home
                </Button>
            </Link>
        </div>
    );
}
