'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Link from 'next/link';
import { WhiteBlock } from '../white-block';
import { FormInput } from '../form';
import { ErrorText } from '../error-text';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useDictionary, useLocalizeHref } from '../i18n/dictionary-provider';

interface Props {
    className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
    const dict = useDictionary();
    const localizeHref = useLocalizeHref();
    const { control, formState: { errors } } = useFormContext();
    const privacyError = errors['privacyConsent']?.message as string | undefined;

    return (
        <WhiteBlock title={dict.checkout.personalSection} className={className}>
            <div className='grid grid-cols-2 gap-5'>
                <FormInput
                    name='firstName'
                    className='text-base'
                    placeholder={dict.checkout.firstName}
                />
                <FormInput
                    name='lastName'
                    className='text-base'
                    placeholder={dict.checkout.lastName}
                />
                <FormInput
                    name='email'
                    className='text-base'
                    placeholder={dict.checkout.email}
                />
                <FormInput
                    name='phone'
                    className='text-base'
                    placeholder={dict.checkout.phone}
                />
            </div>

            <div className='mt-5'>
                <Controller
                    name='privacyConsent'
                    control={control}
                    render={({ field }) => (
                        <label className='flex cursor-pointer items-start gap-3'>
                            <Checkbox
                                id='privacy-consent'
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                                className='mt-0.5'
                            />
                            <span className='text-sm text-muted-foreground'>
                                {dict.checkout.privacyConsentLabel}
                                <Link
                                    href={localizeHref('/privacy')}
                                    target='_blank'
                                    className='text-primary underline'
                                >
                                    {dict.checkout.privacyConsentLinkText}
                                </Link>
                            </span>
                        </label>
                    )}
                />
                {privacyError && <ErrorText text={privacyError} className='mt-2' />}
            </div>
        </WhiteBlock>
    );
};
