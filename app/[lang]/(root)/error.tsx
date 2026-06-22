'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import {
    useDictionary,
    useLocalizeHref,
} from '@/shared/components/shared/i18n/dictionary-provider';

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function RootError({ error, reset }: Props) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    const dict = useDictionary();
    const localize = useLocalizeHref();

    return (
        <div className='flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center'>
            <div className='flex flex-col items-center gap-2'>
                <h2 className='text-2xl font-bold'>{dict.errors.title}</h2>
                <p className='max-w-sm text-muted-foreground'>{dict.errors.text}</p>
            </div>
            <div className='flex gap-3'>
                <Button onClick={reset} className='gap-2'>
                    <RotateCcw className='size-4' />
                    {dict.errors.retry}
                </Button>
                <Button asChild variant='outline' className='gap-2'>
                    <Link href={localize('/')}>
                        <Home className='size-4' />
                        {dict.common.backHome}
                    </Link>
                </Button>
            </div>
        </div>
    );
}
