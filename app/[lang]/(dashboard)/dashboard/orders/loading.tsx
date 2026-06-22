import { Skeleton } from '@/shared/components/ui/skeleton';

function OrderRowSkeleton() {
    return (
        <li className='glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='min-w-0 flex-1 space-y-2'>
                <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-24 rounded' />
                    <Skeleton className='h-5 w-20 rounded-full' />
                </div>
                <Skeleton className='h-4 w-48 rounded' />
                <Skeleton className='h-4 w-64 rounded' />
                <div className='space-y-1 pt-1'>
                    <Skeleton className='h-4 w-56 rounded' />
                    <Skeleton className='h-4 w-36 rounded' />
                </div>
            </div>
            <div className='flex items-center gap-3 sm:justify-end'>
                <Skeleton className='h-5 w-16 rounded' />
                <Skeleton className='h-9 w-36 rounded-lg' />
            </div>
        </li>
    );
}

export default function OrdersLoading() {
    return (
        <div className='mx-auto max-w-7xl px-4'>
            <Skeleton className='h-9 w-48 rounded' />

            <div className='mt-6 flex flex-col gap-8 lg:flex-row lg:gap-10'>
                {/* Sidebar */}
                <aside className='w-full lg:w-72 lg:shrink-0'>
                    <div className='hidden rounded-3xl border border-border bg-card p-5 lg:block space-y-4'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className='h-9 w-full rounded-lg' />
                        ))}
                    </div>
                </aside>

                {/* Orders list */}
                <div className='min-w-0 flex-1'>
                    <ul className='space-y-3'>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <OrderRowSkeleton key={i} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
