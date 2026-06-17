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
                text='Grazie per il tuo ordine!'
                size='lg'
                className='font-extrabold'
            />

            <p className='max-w-md text-lg text-muted-foreground'>
                {orderId
                    ? `Il pagamento è andato a buon fine e l'ordine #${orderId} è confermato. Inizieremo subito a prepararlo.`
                    : 'Il pagamento è andato a buon fine e il tuo ordine è confermato.'}
            </p>

            <Link href='/'>
                <Button className='mt-4 h-12 gap-2 px-6 text-base'>
                    <ArrowLeft className='w-5' />
                    Torna alla home
                </Button>
            </Link>
        </div>
    );
}
