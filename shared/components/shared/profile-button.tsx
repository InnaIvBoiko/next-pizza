import { useSession } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/button';
import { CircleUser, User } from 'lucide-react';
import Link from 'next/link';

interface Props {
    onClickSignIn?: () => void;
    className?: string;
}

export const ProfileButton: React.FC<Props> = ({
    className,
    onClickSignIn,
}) => {
    const { data: session } = useSession();

    // The session is only resolved on the client, so render the signed-out
    // button until mounted — this keeps the server HTML and the first client
    // render identical and avoids a hydration mismatch. useSyncExternalStore
    // returns the server snapshot (false) during SSR/first render and the
    // client snapshot (true) afterwards, without a setState-in-effect.
    const mounted = React.useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    return (
        <div className={className}>
            {!mounted || !session ? (
                <Button
                    onClick={onClickSignIn}
                    variant='outline'
                    className='flex items-center gap-1'
                >
                    <User size={16} />
                    Login
                </Button>
            ) : (
                <Link href='/profile'>
                    <Button
                        variant='secondary'
                        className='flex items-center gap-2'
                    >
                        <CircleUser size={18} />
                        Profile
                    </Button>
                </Link>
            )}
        </div>
    );
};
