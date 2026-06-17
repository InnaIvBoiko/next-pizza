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
import { useDictionary } from '../../i18n/dictionary-provider';
import { LoginForm } from './forms/login-form';
import { RegisterForm } from './forms/register-form';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
    const dict = useDictionary();
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
                    {type === 'login'
                        ? dict.auth.signIn
                        : dict.auth.register.submit}
                </DialogTitle>
                <DialogDescription className='sr-only'>
                    {dict.auth.modalDescription}
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
                    {dict.auth.continueWithGoogle}
                </Button>

                <Button
                    variant='outline'
                    onClick={onSwitchType}
                    type='button'
                    className='h-12'
                >
                    {type === 'login'
                        ? dict.auth.register.submit
                        : dict.auth.signIn}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
