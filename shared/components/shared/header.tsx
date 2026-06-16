'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui';
import { SearchInput } from './search-input';
import { CartButton } from './cart-button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
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
                'Order successfully paid! Information sent to email.';
        }

        if (searchParams.has('verified')) {
            toastMessage = 'Email successfully verified!';
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
                        <Image
                            src='/logo.png'
                            alt='Next Pizza'
                            width={35}
                            height={35}
                            className='size-8 sm:size-9'
                        />
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
                                <Link href='/menu'>
                                    <span className='transition-transform duration-300 group-hover:-translate-x-1.5'>
                                        Menu
                                    </span>
                                    <ArrowRight
                                        size={18}
                                        className='absolute right-4 translate-x-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100'
                                    />
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Right section */}
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <ThemeToggle />

                        <AuthModal
                            open={openAuthModal}
                            onClose={() => setOpenAuthModal(false)}
                        />

                        <ProfileButton
                            onClickSignIn={() => setOpenAuthModal(true)}
                        />

                        {hasCart && <CartButton hideWhenEmpty={isHome} />}
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
