import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Title } from '@/shared/components/shared/title';
import { Button } from '@/shared/components/ui';
import { getDictionary } from '../../../dictionaries';
import { format } from '@/shared/lib/i18n/format';
import { localizeHref } from '@/shared/lib/i18n/localize-href';
import type { Locale } from '@/shared/constants/i18n';

interface Props {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutSuccessPage({
    params,
    searchParams,
}: Props) {
    const { lang } = await params;
    const { orderId } = await searchParams;
    const dict = await getDictionary(lang as Locale);

    return (
        <div className='flex flex-col items-center justify-center gap-6 py-24 text-center'>
            <div className='text-7xl'>🎉</div>

            <Title
                text={dict.success.title}
                size='lg'
                className='font-extrabold'
            />

            <p className='max-w-md text-lg text-muted-foreground'>
                {orderId
                    ? format(dict.success.messageWithId, { orderId })
                    : dict.success.message}
            </p>

            <Link href={localizeHref(lang as Locale, '/')}>
                <Button className='mt-4 h-12 gap-2 px-6 text-base'>
                    <ArrowLeft className='w-5' />
                    {dict.success.backHome}
                </Button>
            </Link>
        </div>
    );
}
