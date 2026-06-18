import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface Props {
    currentPage: number;
    totalPages: number;
    /** Build the href for a given page (callers preserve their own filters). */
    hrefForPage: (page: number) => string;
    className?: string;
}

// Windowed page list with ellipses: 1 … 4 5 6 … 20
const pageRange = (current: number, total: number): (number | 'ellipsis')[] => {
    const delta = 1;
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);
    const range: (number | 'ellipsis')[] = [1];
    if (left > 2) range.push('ellipsis');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push('ellipsis');
    if (total > 1) range.push(total);
    return range;
};

const itemBase =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors';

export const Pagination: React.FC<Props> = ({
    currentPage,
    totalPages,
    hrefForPage,
    className,
}) => {
    if (totalPages <= 1) return null;

    const pages = pageRange(currentPage, totalPages);

    return (
        <nav
            aria-label='Pagination'
            className={cn('mt-6 flex items-center justify-center gap-1', className)}
        >
            {currentPage > 1 ? (
                <Link
                    href={hrefForPage(currentPage - 1)}
                    aria-label='Previous page'
                    className={cn(
                        itemBase,
                        'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                >
                    <ChevronLeft className='size-4' />
                </Link>
            ) : (
                <span className={cn(itemBase, 'text-muted-foreground/40')}>
                    <ChevronLeft className='size-4' />
                </span>
            )}

            {pages.map((p, i) =>
                p === 'ellipsis' ? (
                    <span
                        key={`ellipsis-${i}`}
                        className='px-1 text-muted-foreground'
                    >
                        …
                    </span>
                ) : (
                    <Link
                        key={p}
                        href={hrefForPage(p)}
                        aria-current={p === currentPage ? 'page' : undefined}
                        className={cn(
                            itemBase,
                            p === currentPage
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {p}
                    </Link>
                )
            )}

            {currentPage < totalPages ? (
                <Link
                    href={hrefForPage(currentPage + 1)}
                    aria-label='Next page'
                    className={cn(
                        itemBase,
                        'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                >
                    <ChevronRight className='size-4' />
                </Link>
            ) : (
                <span className={cn(itemBase, 'text-muted-foreground/40')}>
                    <ChevronRight className='size-4' />
                </span>
            )}
        </nav>
    );
};
