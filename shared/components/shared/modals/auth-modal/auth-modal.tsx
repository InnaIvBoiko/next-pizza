'use client';

import React from 'react';
import { signIn } from 'next-auth/react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '../../../ui';
import { LoginForm } from './forms/login-form';
import { RegisterForm } from './forms/register-form';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
    const [type, setType] = React.useState<'login' | 'register'>('login');

    const onSwitchType = () => {
        setType(type === 'login' ? 'register' : 'login');
    };

    const handleClose = () => {
        // Reset to the login tab so the next open starts fresh.
        setType('login');
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='w-112.5 bg-card p-10'>
                <DialogTitle className='sr-only'>
                    {type === 'login' ? 'Accedi' : 'Registrati'}
                </DialogTitle>
                <DialogDescription className='sr-only'>
                    Accedi al tuo account Next Pizza
                </DialogDescription>

                {type === 'login' ? (
                    <LoginForm onClose={handleClose} />
                ) : (
                    <RegisterForm onClose={handleClose} />
                )}

                <hr />

                <Button
                    variant='secondary'
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    type='button'
                    className='h-12 gap-2 p-2'
                >
                    Continua con Google
                </Button>

                <Button
                    variant='outline'
                    onClick={onSwitchType}
                    type='button'
                    className='h-12'
                >
                    {type === 'login' ? 'Registrati' : 'Accedi'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
