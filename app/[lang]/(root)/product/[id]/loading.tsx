import { Skeleton } from '@/shared/components/ui/skeleton';

export default function ProductLoading() {
    return (
        <div className='mx-auto max-w-7xl my-10 flex flex-col'>
            <div className='flex flex-1 flex-col lg:flex-row'>
                {/* Pizza image area */}
                <div className='flex items-center justify-center p-6 lg:flex-1'>
                    <Skeleton className='aspect-square w-full max-w-sm rounded-full lg:max-w-md' />
                </div>

                {/* Right panel */}
                <div className='w-full bg-card p-5 sm:p-7 lg:w-122.5'>
                    <Skeleton className='h-8 w-3/4 rounded' />
                    <Skeleton className='mt-2 h-4 w-full rounded' />
                    <Skeleton className='mt-1 h-4 w-2/3 rounded' />

                    {/* Size / type variants */}
                    <div className='mt-5 flex flex-col gap-4'>
                        <Skeleton className='h-12 w-full rounded-xl' />
                        <Skeleton className='h-12 w-full rounded-xl' />
                    </div>

                    {/* Ingredients scrollable area */}
                    <div className='mt-5 h-64 rounded-md bg-muted p-4 sm:p-5 lg:h-105'>
                        <Skeleton className='mb-3 h-4 w-32 rounded' />
                        <div className='grid grid-cols-3 gap-3'>
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className='flex flex-col items-center gap-1'>
                                    <Skeleton className='aspect-square w-full rounded-lg' />
                                    <Skeleton className='h-3 w-4/5 rounded' />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Skeleton className='mt-10 h-13.75 w-full rounded-[18px]' />
                </div>
            </div>
        </div>
    );
}
