import { cn } from '@/shared/lib/utils';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/shared/constants/images';
import Image from 'next/image';

interface Props {
    src: string;
    className?: string;
}

export const CartItemDetailsImage: React.FC<Props> = ({ src, className }) => {
    return (
        <Image
            className={cn('h-15 w-15', className)}
            src={src || PRODUCT_IMAGE_PLACEHOLDER}
            width={60}
            height={60}
            alt='CartItemDetailsImage'
        />
    );
};
