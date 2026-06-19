'use client';

import React from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { AdminProductEditor } from './admin-product-editor';
import { AdminCategoryManager } from './admin-category-manager';
import { ProductAvailabilityToggle } from './product-availability-toggle';
import { localizeName } from '@/shared/lib/i18n/localize-name';
import { localizeDescription } from '@/shared/lib/i18n/localize-description';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/shared/constants/images';
import { useDictionary, useLocale } from './i18n/dictionary-provider';

interface Product {
    id: number;
    name: string;
    nameIt: string | null;
    description: string | null;
    descriptionIt: string | null;
    imageUrl: string;
    /** Manual out-of-stock override (drives the toggle). */
    available: boolean;
    /** Override AND all included ingredients in stock (drives the filter). */
    effectiveAvailable: boolean;
    categoryId: number;
    includedIds: number[];
    extraIds: number[];
    items: {
        id: number;
        price: number;
        size: number | null;
        pizzaType: number | null;
    }[];
}

interface Category {
    id: number;
    name: string;
    nameIt: string | null;
    productCount: number;
}

interface Props {
    products: Product[];
    categories: Category[];
    /** All ingredients with locale-appropriate names, for the editor. */
    ingredients: { id: number; name: string }[];
}

type Status = 'all' | 'available' | 'unavailable';

export const AdminProductsManager: React.FC<Props> = ({
    products,
    categories,
    ingredients,
}) => {
    const dict = useDictionary();
    const locale = useLocale();
    const [query, setQuery] = React.useState('');
    const [status, setStatus] = React.useState<Status>('all');
    const [categoryId, setCategoryId] = React.useState<number | 'all'>('all');

    // Categories with locale-appropriate names, for the filter pills and the
    // category <select> inside the product editor.
    const localizedCategories = categories.map(category => ({
        id: category.id,
        name: localizeName(category, locale),
    }));

    const visible = products.filter(product => {
        const displayName = localizeName(product, locale);
        if (
            query.trim() &&
            !displayName.toLowerCase().includes(query.trim().toLowerCase())
        ) {
            return false;
        }
        if (status === 'available' && !product.effectiveAvailable) return false;
        if (status === 'unavailable' && product.effectiveAvailable) return false;
        if (categoryId !== 'all' && product.categoryId !== categoryId) {
            return false;
        }
        return true;
    });

    const pill = (active: boolean) =>
        cn(
            'rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors',
            active
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
        );
    const sectionTitle = 'mb-2 text-sm font-bold';

    const filters = (
        <div>
            <div className='relative'>
                <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
                <input
                    type='search'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={dict.admin.products.searchPlaceholder}
                    className='w-full rounded-full bg-muted py-2 pr-4 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
            </div>

            <div className='mt-5'>
                <p className={sectionTitle}>{dict.admin.products.statusLabel}</p>
                <div className='flex flex-wrap gap-2'>
                    <button
                        type='button'
                        className={pill(status === 'all')}
                        onClick={() => setStatus('all')}
                    >
                        {dict.admin.products.allStatus}
                    </button>
                    <button
                        type='button'
                        className={pill(status === 'available')}
                        onClick={() => setStatus('available')}
                    >
                        {dict.admin.products.available}
                    </button>
                    <button
                        type='button'
                        className={pill(status === 'unavailable')}
                        onClick={() => setStatus('unavailable')}
                    >
                        {dict.admin.products.unavailable}
                    </button>
                </div>
            </div>

            <div className='mt-5'>
                <p className={sectionTitle}>
                    {dict.admin.products.categoryLabel}
                </p>
                <div className='flex flex-wrap gap-2'>
                    <button
                        type='button'
                        className={pill(categoryId === 'all')}
                        onClick={() => setCategoryId('all')}
                    >
                        {dict.admin.products.allCategories}
                    </button>
                    {localizedCategories.map(category => (
                        <button
                            key={category.id}
                            type='button'
                            className={pill(categoryId === category.id)}
                            onClick={() => setCategoryId(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className='flex flex-col gap-8 lg:flex-row lg:gap-10'>
            <aside className='w-full lg:w-72 lg:shrink-0'>
                <div className='glass scrollbar rounded-3xl p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto'>
                    {filters}
                </div>
            </aside>

            <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap gap-2'>
                    <AdminProductEditor
                        categories={localizedCategories}
                        ingredients={ingredients}
                    />
                    <AdminCategoryManager categories={categories} />
                </div>

                {visible.length === 0 ? (
                    <p className='mt-6 text-sm text-muted-foreground'>
                        {dict.admin.products.empty}
                    </p>
                ) : (
                    <ul className='mt-6 space-y-3'>
                        {visible.map(product => (
                            <li
                                key={product.id}
                                className='glass flex items-center justify-between gap-3 rounded-2xl p-4'
                            >
                                <div className='flex min-w-0 items-center gap-3'>
                                    <div className='relative size-12 shrink-0 overflow-hidden rounded-xl bg-secondary'>
                                        <Image
                                            src={
                                                product.imageUrl ||
                                                PRODUCT_IMAGE_PLACEHOLDER
                                            }
                                            alt=''
                                            fill
                                            sizes='48px'
                                            className='object-contain p-1'
                                        />
                                    </div>
                                    <div className='min-w-0'>
                                        <div
                                            className={cn(
                                                'truncate font-bold',
                                                !product.effectiveAvailable &&
                                                    'text-muted-foreground line-through'
                                            )}
                                        >
                                            {localizeName(product, locale)}
                                        </div>
                                        {localizeDescription(
                                            product,
                                            locale
                                        ) && (
                                            <div className='truncate text-sm text-muted-foreground'>
                                                {localizeDescription(
                                                    product,
                                                    locale
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='flex shrink-0 items-center gap-2'>
                                    <ProductAvailabilityToggle
                                        productId={product.id}
                                        available={product.available}
                                    />
                                    <AdminProductEditor
                                        product={{
                                            id: product.id,
                                            name: product.name,
                                            nameIt: product.nameIt,
                                            description: product.description,
                                            descriptionIt:
                                                product.descriptionIt,
                                            imageUrl: product.imageUrl,
                                            categoryId: product.categoryId,
                                            includedIds: product.includedIds,
                                            extraIds: product.extraIds,
                                            items: product.items,
                                        }}
                                        categories={localizedCategories}
                                        ingredients={ingredients}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
