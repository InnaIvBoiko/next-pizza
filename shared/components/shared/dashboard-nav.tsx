'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { localizeHref } from '@/shared/lib/i18n/localize-href';
import type { Locale } from '@/shared/constants/i18n';

interface Props {
    lang: Locale;
    /** Admins manage orders/products; kitchen staff only see kitchen + stock. */
    isAdmin: boolean;
    ordersLabel: string;
    productsLabel: string;
    kitchenLabel: string;
    inventoryLabel: string;
}

export const DashboardNav: React.FC<Props> = ({
    lang,
    isAdmin,
    ordersLabel,
    productsLabel,
    kitchenLabel,
    inventoryLabel,
}) => {
    const pathname = usePathname();

    const items = [
        ...(isAdmin
            ? [
                  {
                      href: localizeHref(lang, '/dashboard/orders'),
                      label: ordersLabel,
                      match: '/dashboard/orders',
                  },
                  {
                      href: localizeHref(lang, '/dashboard/products'),
                      label: productsLabel,
                      match: '/dashboard/products',
                  },
              ]
            : []),
        {
            href: localizeHref(lang, '/dashboard/kitchen'),
            label: kitchenLabel,
            match: '/dashboard/kitchen',
        },
        {
            href: localizeHref(lang, '/dashboard/inventory'),
            label: inventoryLabel,
            match: '/dashboard/inventory',
        },
    ];

    return (
        <nav className='flex items-center gap-1'>
            {items.map(item => {
                const active = pathname.includes(item.match);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                            'rounded-full px-3 py-2 text-sm font-semibold transition-colors',
                            active
                                ? 'bg-primary/10 text-primary'
                                : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
};
