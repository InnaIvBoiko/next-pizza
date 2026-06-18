'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { OrderStatus } from '@/generated/prisma/enums';
import { useDictionary } from './i18n/dictionary-provider';

const STATUSES = Object.values(OrderStatus);
const PERIODS = ['today', '3d', 'week', 'month'] as const;
const SORTS = ['newest', 'priceAsc', 'priceDesc'] as const;

interface Props {
    className?: string;
}

export const AdminOrdersFilters: React.FC<Props> = ({ className }) => {
    const dict = useDictionary();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const status = searchParams.get('status') ?? '';
    const period = searchParams.get('period') ?? 'today';
    const sort = searchParams.get('sort') ?? 'newest';
    const q = searchParams.get('q') ?? '';

    const [qLocal, setQLocal] = React.useState(q);
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Push a new URL with one filter changed; an empty value drops the param
    // (so defaults stay out of the URL). Other filters are preserved.
    const update = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        // Any filter change resets to the first page.
        params.delete('page');
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    const onSearch = (value: string) => {
        setQLocal(value);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => update('q', value.trim()), 350);
    };

    const pill = (active: boolean) =>
        cn(
            'rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors',
            active
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
        );

    const sectionTitle = 'mb-2 text-sm font-bold';

    return (
        <div className={className}>
            <input
                type='search'
                value={qLocal}
                onChange={e => onSearch(e.target.value)}
                placeholder={dict.admin.searchPlaceholder}
                className='w-full rounded-full bg-muted px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
            />

            <div className='mt-5'>
                <p className={sectionTitle}>{dict.admin.sortLabel}</p>
                <select
                    aria-label={dict.admin.sortLabel}
                    value={sort}
                    onChange={e =>
                        update(
                            'sort',
                            e.target.value === 'newest' ? '' : e.target.value
                        )
                    }
                    className='w-full rounded-full border border-input bg-background px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring'
                >
                    {SORTS.map(s => (
                        <option key={s} value={s}>
                            {dict.admin.sort[s]}
                        </option>
                    ))}
                </select>
            </div>

            <div className='mt-5'>
                <p className={sectionTitle}>{dict.admin.periodLabel}</p>
                <div className='flex flex-wrap gap-2'>
                    {([...PERIODS, 'all'] as const).map(p => (
                        <button
                            key={p}
                            type='button'
                            className={pill(period === p)}
                            onClick={() =>
                                update('period', p === 'today' ? '' : p)
                            }
                        >
                            {dict.admin.period[p]}
                        </button>
                    ))}
                </div>
            </div>

            <div className='mt-5'>
                <p className={sectionTitle}>{dict.admin.statusLabel}</p>
                <div className='flex flex-wrap gap-2'>
                    <button
                        type='button'
                        className={pill(!status)}
                        onClick={() => update('status', '')}
                    >
                        {dict.admin.filterAll}
                    </button>
                    {STATUSES.map(s => (
                        <button
                            key={s}
                            type='button'
                            className={pill(status === s)}
                            onClick={() => update('status', s)}
                        >
                            {dict.orders.status[s]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
