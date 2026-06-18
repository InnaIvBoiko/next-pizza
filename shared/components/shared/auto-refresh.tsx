'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Props {
    /** Refresh interval in milliseconds (default 15s). */
    intervalMs?: number;
}

/** Periodically re-fetches the current route's server data (e.g. kitchen board). */
export const AutoRefresh: React.FC<Props> = ({ intervalMs = 15000 }) => {
    const router = useRouter();

    React.useEffect(() => {
        const id = setInterval(() => router.refresh(), intervalMs);
        return () => clearInterval(id);
    }, [router, intervalMs]);

    return null;
};
