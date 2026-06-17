'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Title } from './title';
import { useDictionary, useLocalizeHref } from './i18n/dictionary-provider';

interface Props {
    title: string;
    text: string;
    className?: string;
    imageUrl?: string;
}

export const InfoBlock: React.FC<Props> = ({
    className,
    title,
    text,
    imageUrl,
}) => {
    const dict = useDictionary();
    const localize = useLocalizeHref();

    return (
        <div
            className={cn(
                className,
                'flex w-210 items-center justify-between gap-12'
            )}
        >
            <div className='flex flex-col'>
                <div className='w-111.25'>
                    <Title size='lg' text={title} className='font-extrabold' />
                    <p className='text-lg text-muted-foreground'>{text}</p>
                </div>

                <div className='mt-11 flex gap-5'>
                    <Link href={localize('/')}>
                        <Button variant='outline' className='gap-2'>
                            <ArrowLeft />
                            {dict.common.backHome}
                        </Button>
                    </Link>
                    <a href=''>
                        <Button
                            variant='outline'
                            className='border-border text-muted-foreground hover:bg-muted'
                        >
                            {dict.common.refresh}
                        </Button>
                    </a>
                </div>
            </div>

            {imageUrl && <Image src={imageUrl} alt={title} width={300} />}
        </div>
    );
};
