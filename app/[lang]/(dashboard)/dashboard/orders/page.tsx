import { MapPin, Phone, StickyNote } from 'lucide-react';

import { prisma } from '@/prisma/prisma-client';
import { getAdminSession } from '@/shared/lib/get-admin-session';
import { Container } from '@/shared/components/shared/container';
import { OrderStatusBadge } from '@/shared/components/shared/order-status-badge';
import { AdminOrderStatusSelect } from '@/shared/components/shared/admin-order-status-select';
import { AdminOrdersFilters } from '@/shared/components/shared/admin-orders-filters';
import { AdminOrdersFiltersDrawer } from '@/shared/components/shared/admin-orders-filters-drawer';
import { Pagination } from '@/shared/components/shared/pagination';
import { orderItemsSummary } from '@/shared/lib/order-items';
import { formatPrice } from '@/shared/lib';
import { format } from '@/shared/lib/i18n/format';
import { localizeHref } from '@/shared/lib/i18n/localize-href';
import { RESTAURANT_TIME_ZONE } from '@/shared/constants/restaurant';
import type { Locale } from '@/shared/constants/i18n';
import { OrderStatus, Prisma } from '@/generated/prisma/client';
import { getDictionary } from '../../../dictionaries';

export const dynamic = 'force-dynamic';

const STATUSES = Object.values(OrderStatus);
const DAY = 86_400_000;
const PAGE_SIZE = 20;

// Instant of "today at 00:00" in the restaurant timezone (now minus the local
// time-of-day), so the "today" filter matches the calendar day, not UTC.
const startOfDayInTz = (tz: string): Date => {
    const now = new Date();
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
            .formatToParts(now)
            .map(p => [p.type, p.value])
    );
    const ms =
        (Number(parts.hour) * 3600 +
            Number(parts.minute) * 60 +
            Number(parts.second)) *
        1000;
    return new Date(now.getTime() - ms);
};

const periodStart = (period?: string): Date | undefined => {
    switch (period) {
        case 'today':
            return startOfDayInTz(RESTAURANT_TIME_ZONE);
        case '3d':
            return new Date(Date.now() - 3 * DAY);
        case 'week':
            return new Date(Date.now() - 7 * DAY);
        case 'month':
            return new Date(Date.now() - 30 * DAY);
        default:
            return undefined;
    }
};

interface Props {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{
        status?: string;
        period?: string;
        q?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function AdminOrdersPage({ params, searchParams }: Props) {
    await getAdminSession();

    const { lang } = await params;
    const { status, period: rawPeriod, q, sort, page } = await searchParams;
    const dict = await getDictionary(lang as Locale);

    const currentPage = Math.max(1, Number(page) || 1);

    const activeFilter = STATUSES.includes(status as OrderStatus)
        ? (status as OrderStatus)
        : undefined;
    // Default to today's orders; an explicit "all" clears the date filter.
    const period = rawPeriod ?? 'today';
    const start = periodStart(period);
    const trimmedQ = (q ?? '').trim();

    const where: Prisma.OrderWhereInput = {
        ...(activeFilter ? { status: activeFilter } : {}),
        ...(start ? { createdAt: { gte: start } } : {}),
        ...(trimmedQ
            ? {
                  OR: [
                      { fullName: { contains: trimmedQ, mode: 'insensitive' } },
                      ...(/^\d+$/.test(trimmedQ)
                          ? [{ id: Number(trimmedQ) }]
                          : []),
                  ],
              }
            : {}),
    };

    const orderBy =
        sort === 'priceAsc'
            ? { totalAmount: 'asc' as const }
            : sort === 'priceDesc'
              ? { totalAmount: 'desc' as const }
              : { createdAt: 'desc' as const };

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy,
            skip: (currentPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.order.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    // Preserve the active filters when paging.
    const hrefForPage = (p: number) => {
        const params = new URLSearchParams();
        if (activeFilter) params.set('status', activeFilter);
        if (rawPeriod) params.set('period', rawPeriod);
        if (trimmedQ) params.set('q', trimmedQ);
        if (sort) params.set('sort', sort);
        if (p > 1) params.set('page', String(p));
        const qs = params.toString();
        return localizeHref(
            lang as Locale,
            `/dashboard/orders${qs ? `?${qs}` : ''}`
        );
    };

    const dateFormatter = new Intl.DateTimeFormat(lang, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: RESTAURANT_TIME_ZONE,
    });

    return (
        <Container className='px-4'>
            <h1 className='text-3xl font-extrabold'>
                {dict.admin.ordersTitle}
            </h1>

            <div className='mt-6 flex flex-col gap-8 lg:flex-row lg:gap-10'>
                <aside className='w-full lg:w-72 lg:shrink-0'>
                    {/* Mobile: filters in a drawer */}
                    <AdminOrdersFiltersDrawer />

                    {/* Desktop: sticky glass sidebar */}
                    <div className='glass scrollbar hidden rounded-3xl p-5 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto'>
                        <AdminOrdersFilters />
                    </div>
                </aside>

                <div className='min-w-0 flex-1'>
                    {orders.length === 0 ? (
                        <p className='text-muted-foreground'>
                            {dict.admin.empty}
                        </p>
                    ) : (
                        <ul className='space-y-3'>
                            {orders.map(order => (
                                <li
                                    key={order.id}
                                    className='glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between'
                                >
                                    <div className='min-w-0'>
                                        <div className='flex items-center gap-2'>
                                            <span className='font-bold'>
                                                {format(
                                                    dict.orders.orderNumber,
                                                    {
                                                        id: order.id,
                                                    }
                                                )}
                                            </span>
                                            <OrderStatusBadge
                                                status={order.status}
                                                label={
                                                    dict.orders.status[
                                                        order.status
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className='text-muted-foreground mt-1 text-sm'>
                                            {order.fullName} ·{' '}
                                            {dateFormatter.format(
                                                new Date(order.createdAt)
                                            )}
                                        </div>
                                        <div className='text-muted-foreground mt-1 truncate text-sm'>
                                            {orderItemsSummary(order.items)}
                                        </div>

                                        <div className='text-muted-foreground mt-2 space-y-1 text-sm'>
                                            <div className='flex items-start gap-1.5'>
                                                <MapPin className='text-primary mt-0.5 size-4 shrink-0' />
                                                <span>{order.address}</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <Phone className='text-primary size-4 shrink-0' />
                                                <span>{order.phone}</span>
                                            </div>
                                            {order.comment && (
                                                <div className='flex items-start gap-1.5'>
                                                    <StickyNote className='text-primary mt-0.5 size-4 shrink-0' />
                                                    <span>{order.comment}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between gap-3 sm:justify-end'>
                                        <span className='font-semibold'>
                                            {formatPrice(order.totalAmount)}
                                        </span>
                                        <AdminOrderStatusSelect
                                            orderId={order.id}
                                            status={order.status}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        hrefForPage={hrefForPage}
                    />
                </div>
            </div>
        </Container>
    );
}
