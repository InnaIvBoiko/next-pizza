import { Skeleton } from '@/shared/components/ui/skeleton';

function ProductCardSkeleton() {
    return (
        <div className='border-border bg-card flex flex-col rounded-3xl border p-3'>
            <Skeleton className='aspect-square w-full rounded-2xl' />
            <div className='flex flex-1 flex-col gap-2 px-2 pt-4 pb-1'>
                <Skeleton className='h-5 w-3/4 rounded' />
                <Skeleton className='h-4 w-full rounded' />
                <Skeleton className='h-4 w-2/3 rounded' />
                <div className='mt-auto flex items-center justify-between pt-4'>
                    <Skeleton className='h-6 w-24 rounded' />
                    <Skeleton className='size-10 rounded-full' />
                </div>
            </div>
        </div>
    );
}

function CategoryGroupSkeleton() {
    return (
        <div>
            <div className='mb-6 flex items-center gap-3'>
                <Skeleton className='h-7 w-40 rounded' />
                <Skeleton className='h-6 w-10 rounded-full' />
            </div>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
                {Array.from({ length: 3 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export default function MenuLoading() {
    return (
        <>
            {/* Header */}
            <section className='glow-warm'>
                <div className='mx-auto max-w-7xl px-4 pt-8 pb-6 sm:pt-12'>
                    <Skeleton className='h-4 w-24 rounded' />
                    <Skeleton className='mt-2 h-10 w-72 rounded sm:h-12' />
                    <Skeleton className='mt-3 h-4 w-96 max-w-full rounded' />
                </div>
            </section>

            {/* TopBar */}
            <div className='border-border bg-background/80 sticky top-(--header-height,4rem) z-10 border-b backdrop-blur'>
                <div className='mx-auto max-w-7xl px-4'>
                    <div className='flex gap-1 py-3'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className='h-9 w-24 rounded-full'
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className='mx-auto mt-6 max-w-7xl px-4 pb-14 sm:mt-10'>
                <div className='flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-16'>
                    {/* Sidebar */}
                    <aside className='w-full lg:w-72 lg:shrink-0'>
                        <div className='border-border bg-card hidden rounded-3xl border p-5 lg:block'>
                            <Skeleton className='h-5 w-24 rounded' />
                            <div className='mt-4 space-y-3'>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className='h-4 w-full rounded'
                                    />
                                ))}
                            </div>
                            <Skeleton className='mt-6 h-5 w-32 rounded' />
                            <div className='mt-4 space-y-3'>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className='h-4 w-full rounded'
                                    />
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Product groups */}
                    <div className='flex-1'>
                        <div className='flex flex-col gap-12 sm:gap-16'>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <CategoryGroupSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
