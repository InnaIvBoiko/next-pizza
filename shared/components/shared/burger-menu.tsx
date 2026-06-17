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
import { ThemeToggle } from './theme-toggle';
import { ProfileButton } from './profile-button';

interface Props {
    onClickSignIn?: () => void;
    className?: string;
}

const links = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/#chi-siamo', label: 'Chi siamo' },
    { href: '/#come-funziona', label: 'Come funziona' },
];

/**
 * Mobile-only navigation: a hamburger button opening a right drawer with the
 * nav links, theme toggle and login/profile. On md+ these live inline in the
 * header instead.
 */
export const BurgerMenu: React.FC<Props> = ({ onClickSignIn, className }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type='button'
                    aria-label='Apri menu'
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
                    <SheetTitle className='text-lg font-bold'>Menu</SheetTitle>
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

                <div className='mt-auto flex items-center justify-between gap-3 border-t border-border p-4'>
                    <SheetClose asChild>
                        <ProfileButton onClickSignIn={onClickSignIn} />
                    </SheetClose>
                    <ThemeToggle />
                </div>
            </SheetContent>
        </Sheet>
    );
};
