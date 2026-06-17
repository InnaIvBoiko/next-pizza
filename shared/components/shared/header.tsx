'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Container } from './container';
import Link from 'next/link';
import { ArrowRight, Pizza } from 'lucide-react';
import { Button } from '../ui';
import { Logo } from './logo';
import { BurgerMenu } from './burger-menu';
import { SearchInput } from './search-input';
import { CartButton } from './cart-button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ProfileButton } from './profile-button';
import { ThemeToggle } from './theme-toggle';
import { AuthModal } from './modals';

interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
    className?: string;
}

export const Header: React.FC<Props> = ({
    hasSearch = true,
    hasCart = true,
    className,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [openAuthModal, setOpenAuthModal] = React.useState(false);

    const searchParams = useSearchParams();

    // On the landing the search bar is noise; the cart only shows once it has
    // items. Shop pages keep the full header.
    const isHome = pathname === '/';
    const showSearch = hasSearch && !isHome;

    React.useEffect(() => {
        let toastMessage = '';

        if (searchParams.has('paid')) {
            toastMessage =
                'Ordine pagato! I dettagli sono nella tua email.';
        }

        if (searchParams.has('verified')) {
            toastMessage = 'Email verificata con successo!';
        }

        if (toastMessage) {
            setTimeout(() => {
                router.replace('/');
                toast.success(toastMessage, {
                    duration: 3000,
                });
            }, 1000);
        }
    }, [router, searchParams]);

    return (
        <header
            className={cn(
                'glass-strong sticky top-0 z-50 border-0 border-b',
                className
            )}
        >
            <Container className='px-4'>
                <div className='relative flex items-center justify-between gap-3 py-3 sm:py-4'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center gap-3'>
                        <Logo className='h-9 w-auto sm:h-10' />
                        <div className='leading-none'>
                            <span className='text-lg font-black sm:text-xl'>
                                Next Pizza
                            </span>
                            <p className='hidden text-xs text-muted-foreground sm:block'>
                                La vera pizza italiana
                            </p>
                        </div>
                    </Link>

                    {/* Desktop search */}
                    {showSearch && (
                        <div className='mx-6 hidden max-w-xl flex-1 lg:block'>
                            <SearchInput />
                        </div>
                    )}

                    {/* Centered Menu button (home only) */}
                    {isHome && (
                        <div className='absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center md:flex'>
                            <Button
                                asChild
                                className='group relative rounded-full px-6'
                            >
                                <Link
                                    href='/menu'
                                    className='inline-flex items-center gap-2'
                                >
                                    Menu
                                    <span className='relative inline-flex size-4 items-center justify-center'>
                                        <Pizza
                                            size={16}
                                            className='absolute transition-all duration-300 group-hover:scale-50 group-hover:opacity-0'
                                        />
                                        <ArrowRight
                                            size={16}
                                            className='absolute -translate-x-1 scale-50 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100'
                                        />
                                    </span>
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Right section */}
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <AuthModal
                            open={openAuthModal}
                            onClose={() => setOpenAuthModal(false)}
                        />

                        {/* Desktop actions */}
                        <ThemeToggle className='hidden md:inline-flex' />
                        <ProfileButton
                            className='hidden md:block'
                            onClickSignIn={() => setOpenAuthModal(true)}
                        />

                        {hasCart && <CartButton hideWhenEmpty={isHome} />}

                        {/* Mobile burger */}
                        <BurgerMenu
                            className='md:hidden'
                            onClickSignIn={() => setOpenAuthModal(true)}
                        />
                    </div>
                </div>

                {/* Mobile search */}
                {showSearch && (
                    <div className='pb-3 lg:hidden'>
                        <SearchInput />
                    </div>
                )}
            </Container>
        </header>
    );
};
