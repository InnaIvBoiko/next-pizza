'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '../ui';

interface Props {
    label: string;
    className?: string;
}

/** Logout button for staff inside the dashboard/kitchen header. */
export const SignOutButton = ({ label, className }: Props) => (
    <Button
        variant='ghost'
        size='sm'
        className={cn('rounded-full', className)}
        onClick={() => signOut({ callbackUrl: '/' })}
    >
        <LogOut className='mr-1.5 size-4' />
        {label}
    </Button>
);
