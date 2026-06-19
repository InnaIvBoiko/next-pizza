'use client';

import React from 'react';
import { WhiteBlock } from '../white-block';
import { FormInput, FormTextarea } from '../form';
import { CheckoutAddressBook } from './checkout-address-book';
import { useDictionary } from '../i18n/dictionary-provider';

interface Props {
    className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
    const dict = useDictionary();

    return (
        <WhiteBlock title={dict.checkout.addressSection} className={className}>
            <div className='flex flex-col gap-5'>
                <CheckoutAddressBook />

                <FormInput
                    name='address'
                    className='text-base'
                    placeholder={dict.checkout.address}
                />

                <FormTextarea
                    name='comment'
                    className='text-base'
                    placeholder={dict.checkout.comment}
                    rows={5}
                />
            </div>
        </WhiteBlock>
    );
};
