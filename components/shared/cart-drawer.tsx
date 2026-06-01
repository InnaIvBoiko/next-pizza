import { Button } from '@/components/ui/button';
import {
    Sheet,
    //   SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { CartItem } from './cart-item';
import { ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className='flex flex-col justify-between bg-[#F4F1EE] pb-0'>
                <div>
                    <SheetHeader>
                        <SheetTitle>
                            В корзине{' '}
                            <span className='font-bold'>3 товара</span>
                        </SheetTitle>
                    </SheetHeader>

                    <div className='-mx-6 mt-5 flex flex-col gap-2'>
                        <CartItem
                            name='Чизбургер-пицца'
                            imageUrl='https://media.dodostatic.net/image/r:292x292/11EE7D610BBEB562BD4D48786AD87270.webp'
                            price={500}
                        />
                        <CartItem
                            name='Чизбургер-пицца'
                            imageUrl='https://media.dodostatic.net/image/r:292x292/11EE7D610BBEB562BD4D48786AD87270.webp'
                            price={350}
                            count={3}
                        />
                    </div>
                </div>

                <SheetFooter className='-mx-6 bg-white p-5'>
                    <Button type='submit' className='h-12 w-full text-base'>
                        Оформить заказ
                        <ArrowRight className='ml-2 w-5' />
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
