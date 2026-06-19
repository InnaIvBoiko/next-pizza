'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useClickAway, useDebounce } from 'react-use';
import Link from 'next/link';
import Image from 'next/image';
import { Api } from '@/shared/services/api-client';
import { Product } from '@/generated/prisma/client';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/shared/constants/images';
import { logger } from '@/shared/lib/logger.client';
import { useDictionary, useLocalizeHref } from './i18n/dictionary-provider';

export const SearchInput = () => {
    const dict = useDictionary();
    const localize = useLocalizeHref();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [focused, setFocused] = React.useState(false);
    const [products, setProducts] = React.useState<Product[]>([]);
    const ref = React.useRef<HTMLInputElement>(null);

    useClickAway(ref, () => setFocused(false));

    useDebounce(
        async () => {
            try {
                const response = await Api.products.search(searchQuery);
                setProducts(response);
            } catch (error) {
                logger.error({ err: error }, '[SearchInput] Search failed');
            }
        },
        250,
        [searchQuery]
    );

    const onClickItem = () => {
        setFocused(false);
        setSearchQuery('');
        setProducts([]);
    };

    return (
        <>
            {focused && (
                <div className='fixed top-0 right-0 bottom-0 left-0 z-30 bg-black/30' />
            )}
            <div
                ref={ref}
                className='relative z-30 flex h-11 flex-1 justify-between rounded-2xl'
            >
                <Search className='absolute top-1/2 left-3 h-5 translate-y-[-50%] text-muted-foreground' />
                <input
                    className='w-full rounded-2xl bg-muted pl-11 outline-none'
                    type='text'
                    placeholder={dict.search.placeholder}
                    onFocus={() => setFocused(true)}
                    // onBlur={() => setFocused(false)}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />

                {products.length > 0 && (
                    <div
                        className={cn(
                            'invisible absolute top-14 z-30 w-full rounded-xl bg-popover border border-border py-2 opacity-0 shadow-md transition-all duration-200',
                            focused && 'visible top-14 opacity-100'
                        )}
                    >
                        {products.map(product => (
                            <Link
                                onClick={onClickItem}
                                key={product.id}
                                className='hover:bg-primary/10 flex w-full items-center gap-3 px-3 py-2'
                                href={localize(`/product/${product.id}`)}
                            >
                                <div className='relative h-8 w-8 shrink-0'>
                                    <Image
                                        className='rounded-sm object-cover'
                                        src={
                                            product.imageUrl ||
                                            PRODUCT_IMAGE_PLACEHOLDER
                                        }
                                        alt={product.name}
                                        fill
                                        sizes='32px'
                                    />
                                </div>
                                <span>{product.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
