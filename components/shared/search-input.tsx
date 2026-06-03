'use client';

import React from 'react';
import { Search } from 'lucide-react';

export const SearchInput = () => {
    return (
        <>
            <div className='relative flex h-11 flex-1 justify-between rounded-2xl'>
                <Search className='absolute top-1/2 left-3 h-5 translate-y-[-50%] text-gray-400' />
                <input
                    className='w-full rounded-2xl bg-gray-50 pl-11 outline-none'
                    type='text'
                    placeholder='Search your pizza...'
                />
            </div>
        </>
    );
};
