'use client';

import React from 'react';
import Link from 'next/link';
import { Menu as MenuIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '../ui/sheet';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from './theme-toggle';
import { LanguageSelect } from './language-select';
import { ProfileButton } from './profile-button';
import { useDictionary, useLocalizeHref } from './i18n/dictionary-provider';

interface Props {
    onClickSignIn?: () => void;
    className?: string;
}

/**
 * Mobile-only navigation: a hamburger button opening a right drawer with the
 * nav links, theme toggle and login/profile. On md+ these live inline in the
 * header instead.
 */
export const BurgerMenu: React.FC<Props> = ({ onClickSignIn, className }) => {
    const dict = useDictionary();
    const localize = useLocalizeHref();
    const { data: session } = useSession();

    const links = [
        { href: localize('/'), label: dict.nav.home },
        { href: localize('/menu'), label: dict.nav.menu },
        { href: localize('/#chi-siamo'), label: dict.nav.aboutUs },
        { href: localize('/#come-funziona'), label: dict.nav.howItWorks },
        ...(session?.user?.role === 'ADMIN'
            ? [{ href: localize('/dashboard'), label: dict.admin.title }]
            : []),
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type='button'
                    aria-label={dict.nav.openMenu}
                    className={cn(
                        'glass inline-flex size-11 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground',
                        className
                    )}
                >
                    <MenuIcon className='size-5' />
                </button>
            </SheetTrigger>

            <SheetContent side='right' className='w-[82vw] max-w-xs'>
                <SheetHeader>
                    <SheetTitle className='text-lg font-bold'>
                        {dict.nav.menu}
                    </SheetTitle>
                </SheetHeader>

                <nav className='flex flex-col gap-1 px-2'>
                    {links.map(link => (
                        <SheetClose asChild key={link.href}>
                            <Link
                                href={link.href}
                                className='rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-muted'
                            >
                                {link.label}
                            </Link>
                        </SheetClose>
                    ))}
                </nav>

                <div className='mt-auto flex flex-col gap-3 border-t border-border p-4'>
                    <LanguageSelect className='w-full justify-between' />
                    <div className='flex items-center justify-between gap-3'>
                        <SheetClose asChild>
                            <ProfileButton onClickSignIn={onClickSignIn} />
                        </SheetClose>
                        <ThemeToggle />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
