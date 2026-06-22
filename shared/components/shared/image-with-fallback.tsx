'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/shared/constants/images';

type Props = ImageProps & { fallbackSrc?: string };

export const ImageWithFallback = ({
    src,
    fallbackSrc = PRODUCT_IMAGE_PLACEHOLDER,
    onError,
    ...props
}: Props) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            {...props}
            src={imgSrc}
            onError={(e) => {
                setImgSrc(fallbackSrc);
                onError?.(e);
            }}
        />
    );
};
