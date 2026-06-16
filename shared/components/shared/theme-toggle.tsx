'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface Props {
    className?: string;
}

export const ThemeToggle: React.FC<Props> = ({ className }) => {
    const { resolvedTheme, setTheme } = useTheme();

    // Icon visibility is driven by the `dark` class (set by next-themes before
    // paint), so the server and client markup match — no hydration mismatch,
    // no mounted state needed.
    return (
        <button
            type='button'
            aria-label='Cambia tema'
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className={cn(
                'glass inline-flex size-11 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground',
                className
            )}
        >
            <Moon className='size-5 dark:hidden' />
            <Sun className='hidden size-5 dark:block' />
        </button>
    );
};
