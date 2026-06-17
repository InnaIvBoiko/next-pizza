import React from 'react';
import { WhiteBlock } from '../white-block';
import { FormInput } from '../form';
import { useDictionary } from '../i18n/dictionary-provider';

interface Props {
    className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
    const dict = useDictionary();

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
        </WhiteBlock>
    );
};
