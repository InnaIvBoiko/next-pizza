'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { useDictionary, useLocalizeHref } from './i18n/dictionary-provider';

const STORAGE_KEY = 'cookie-consent';

type ConsentValue = 'all' | 'essential';

function readStoredConsent(): ConsentValue | null {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v === 'all' || v === 'essential') return v;
    } catch {
        // SSR or private-browsing environments where localStorage is unavailable
    }
    return null;
}

export const CookieBanner: React.FC = () => {
    const dict = useDictionary();
    const localizeHref = useLocalizeHref();
    // null = not yet checked (server), undefined = checked and no consent stored
    const [consent, setConsent] = React.useState<ConsentValue | null | undefined>(null);

    React.useEffect(() => {
        setConsent(readStoredConsent() ?? undefined);
    }, []);

    // null = still hydrating; a stored value = banner already dismissed
    if (consent !== undefined) return null;

    const save = (value: ConsentValue) => {
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch {
            // ignore
        }
        setConsent(value);
    };

    return (
        <div className='fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-lg'>
            <div className='container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex-1 space-y-1'>
                    <p className='text-sm font-semibold'>{dict.cookieBanner.title}</p>
                    <p className='text-xs text-muted-foreground'>
                        {dict.cookieBanner.description}
                    </p>
                    <Link
                        href={localizeHref('/privacy')}
                        className='inline-block text-xs text-primary underline underline-offset-2'
                    >
                        {dict.cookieBanner.learnMore}
                    </Link>
                </div>

                <div className='flex shrink-0 gap-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => save('essential')}
                    >
                        {dict.cookieBanner.essentialOnly}
                    </Button>
                    <Button size='sm' onClick={() => save('all')}>
                        {dict.cookieBanner.acceptAll}
                    </Button>
                </div>
            </div>
        </div>
    );
};
