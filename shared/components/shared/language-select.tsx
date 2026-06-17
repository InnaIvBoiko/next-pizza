'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Globe } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';
import { locales, localeNames, type Locale } from '@/shared/constants/i18n';
import { useLocale } from './i18n/dictionary-provider';

interface Props {
    className?: string;
}

const LOCALE_COOKIE = 'NEXT_LOCALE';
const ONE_YEAR = 60 * 60 * 24 * 365;

export const LanguageSelect: React.FC<Props> = ({ className }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const locale = useLocale();

    const handleChange = (next: string) => {
        if (next === locale) return;

        // Persist the choice so the proxy honours it on locale-less URLs.
        document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${ONE_YEAR};samesite=lax`;

        // Swap the locale segment (always the first one) and keep the rest of
        // the path and query intact.
        const segments = pathname.split('/');
        segments[1] = next;
        const query = searchParams.toString();
        router.push(`${segments.join('/')}${query ? `?${query}` : ''}`);
    };

    return (
        <Select value={locale} onValueChange={handleChange}>
            <SelectTrigger
                aria-label={localeNames[locale]}
                className={cn('h-11 gap-1.5 rounded-full px-3', className)}
            >
                <Globe className='size-4' />
                <SelectValue />
            </SelectTrigger>
            <SelectContent align='end'>
                {locales.map((code) => (
                    <SelectItem key={code} value={code}>
                        {localeNames[code as Locale]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
