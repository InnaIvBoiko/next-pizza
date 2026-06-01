import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Container } from './container';
import { Button } from '../ui/button';
// import { ArrowRight, ShoppingCart } from 'lucide-react';
import { SearchInput } from './search-input';
// import { CartDrawer } from './cart-drawer';

export interface HeaderProps {
    className?: string;
}

export default function Header({ className }: HeaderProps) {
    return (
        <header className={cn('border border-b', className)}>
            <Container className='flex items-center justify-between py-8'>
                <div className='flex items-center gap-4'>
                    <Image src='/logo.png' alt='Logo' width={35} height={35} />
                    <div>
                        <h1 className='text-2xl font-black uppercase'>
                            Next Pizza
                        </h1>
                        <p className='text-sm text-gray-400'>
                            Best pizza in the town
                        </p>
                    </div>
                </div>
                <div className='mx-10 flex-1'>
                    <SearchInput />
                </div>

                <div className='flex items-center gap-3'>
                    <Button variant='outline'>Login</Button>

                    {/* <CartDrawer>
                    <Button className="group relative">
                        <b>€ 20,00</b>
                        <span className="h-full w-px bg-white/30 mx-3" />
                        <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                            <ShoppingCart className="h-4 w-4 relative" strokeWidth={2} />
                            <b>3</b>
                        </div>
                        <ArrowRight className="w-5 absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                    </Button>
                </CartDrawer> */}
                </div>
            </Container>
        </header>
    );
}
