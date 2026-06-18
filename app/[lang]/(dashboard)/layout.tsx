import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { getStaffSession } from '@/shared/lib/get-staff-session';
import { Container } from '@/shared/components/shared/container';
import { Button } from '@/shared/components/ui';
import { ThemeToggle } from '@/shared/components/shared/theme-toggle';
import { DashboardNav } from '@/shared/components/shared/dashboard-nav';
import { SignOutButton } from '@/shared/components/shared/sign-out-button';
import { localizeHref } from '@/shared/lib/i18n/localize-href';
import type { Locale } from '@/shared/constants/i18n';
import { getDictionary } from '../dictionaries';

export const metadata: Metadata = {
    title: 'Next Pizza | Dashboard',
};

interface Props {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}

export default async function DashboardLayout({ children, params }: Props) {
    // Defence in depth: the section is for staff (admins + kitchen); each page
    // narrows access further (admin-only pages use getAdminSession).
    const user = await getStaffSession();
    const isAdmin = user.role === 'ADMIN';

    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    return (
        <div className='min-h-screen'>
            <header className='glass-strong sticky top-0 z-50 border-b border-border'>
                <Container className='flex items-center justify-between gap-4 px-4 py-3'>
                    <DashboardNav
                        lang={lang as Locale}
                        isAdmin={isAdmin}
                        ordersLabel={dict.admin.ordersNav}
                        productsLabel={dict.admin.productsNav}
                        kitchenLabel={dict.kitchen.title}
                        inventoryLabel={dict.inventory.title}
                    />
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <Button
                            asChild
                            variant='ghost'
                            size='sm'
                            className='rounded-full'
                        >
                            <Link href={localizeHref(lang as Locale, '/menu')}>
                                {dict.nav.menu}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant='ghost'
                            size='sm'
                            className='rounded-full'
                        >
                            <Link href={localizeHref(lang as Locale, '/')}>
                                <ArrowLeft className='mr-1.5 size-4' />
                                {dict.admin.backToSite}
                            </Link>
                        </Button>
                        <SignOutButton label={dict.auth.signOut} />
                        <ThemeToggle />
                    </div>
                </Container>
            </header>

            <main className='py-8'>{children}</main>
        </div>
    );
}
