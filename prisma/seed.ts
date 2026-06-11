import { Prisma } from '../generated/prisma/client';
import {
    categories,
    _ingredients,
    products,
    productPrices,
    pizzas,
} from './constants';
import { prisma } from './prisma-client';
import { hashSync } from 'bcrypt';

type ProductItemInput = Prisma.ProductItemUncheckedCreateInput;

// 30 cm = base price; 20 cm is cheaper, 40 cm dearer. Rounded to the nearest 0.5.
const sizeMultiplier: Record<20 | 30 | 40, number> = {
    20: 0.75,
    30: 1,
    40: 1.4,
};

// A pizza gets 3 sizes × 2 doughs (traditional / thin) = 6 ProductItems.
const generatePizzaItems = (
    productId: number,
    basePrice: number
): ProductItemInput[] =>
    ([1, 2] as const).flatMap(pizzaType =>
        ([20, 30, 40] as const).map(size => ({
            productId,
            pizzaType,
            size,
            price: Math.round(basePrice * sizeMultiplier[size] * 2) / 2,
        }))
    );

async function up() {
    await prisma.user.createMany({
        data: [
            {
                fullName: 'User Test',
                email: 'user@test.it',
                password: hashSync('111111', 10),
                verified: new Date(),
                role: 'USER',
            },
            {
                fullName: 'Admin Admin',
                email: 'admin@test.it',
                password: hashSync('111111', 10),
                verified: new Date(),
                role: 'ADMIN',
            },
        ],
    });

    await prisma.category.createMany({
        data: categories,
    });

    await prisma.ingredient.createMany({
        data: _ingredients,
    });

    // Non-pizza products get ids 1..products.length (insertion order).
    await prisma.product.createMany({
        data: products,
    });

    // Pizzas need ingredient relations, so they are created one by one and
    // their generated ids are captured for the size/dough ProductItems.
    const createdPizzas = await Promise.all(
        pizzas.map(pizza =>
            prisma.product.create({
                data: {
                    name: pizza.name,
                    imageUrl: pizza.imageUrl,
                    categoryId: 1,
                    ingredients: {
                        connect: pizza.ingredients.map(id => ({ id })),
                    },
                },
            })
        )
    );

    await prisma.productItem.createMany({
        data: [
            // One item per non-pizza product, priced from constants.
            ...productPrices.map(
                (price, index): ProductItemInput => ({
                    productId: index + 1,
                    price,
                })
            ),
            // Pizzas: 3 sizes × 2 doughs each.
            ...createdPizzas.flatMap((pizza, index) =>
                generatePizzaItems(pizza.id, pizzas[index].base)
            ),
        ],
    });

    await prisma.cart.createMany({
        data: [
            {
                userId: 1,
                totalAmount: 0,
                token: '11111',
            },
            {
                userId: 2,
                totalAmount: 0,
                token: '222222',
            },
        ],
    });

    await prisma.cartItem.create({
        data: {
            productItemId: 1,
            cartId: 1,
            quantity: 2,
            ingredients: {
                connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
            },
        },
    });

    await prisma.story.createMany({
        data: [
            {
                previewImageUrl:
                    'https://cdn.inappstory.ru/story/xep/xzh/zmc/cr4gcw0aselwvf628pbmj3j/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=3101815496',
            },
            {
                previewImageUrl:
                    'https://cdn.inappstory.ru/story/km2/9gf/jrn/sb7ls1yj9fe5bwvuwgym73e/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=3074015640',
            },
            {
                previewImageUrl:
                    'https://cdn.inappstory.ru/story/quw/acz/zf5/zu37vankpngyccqvgzbohj1/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=1336215020',
            },
            {
                previewImageUrl:
                    'https://cdn.inappstory.ru/story/7oc/5nf/ipn/oznceu2ywv82tdlnpwriyrq/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=38903958',
            },
            {
                previewImageUrl:
                    'https://cdn.inappstory.ru/story/q0t/flg/0ph/xt67uw7kgqe9bag7spwkkyw/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=2941222737',
            },
            {
                previewImageUrl:
                    'https://cdn.inappstory.ru/story/lza/rsp/2gc/xrar8zdspl4saq4uajmso38/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=4207486284',
            },
        ],
    });

    await prisma.storyItem.createMany({
        data: [
            {
                storyId: 1,
                sourceUrl:
                    'https://cdn.inappstory.ru/file/dd/yj/sx/oqx9feuljibke3mknab7ilb35t.webp?k=IgAAAAAAAAAE',
            },
            {
                storyId: 1,
                sourceUrl:
                    'https://cdn.inappstory.ru/file/jv/sb/fh/io7c5zarojdm7eus0trn7czdet.webp?k=IgAAAAAAAAAE',
            },
            {
                storyId: 1,
                sourceUrl:
                    'https://cdn.inappstory.ru/file/ts/p9/vq/zktyxdxnjqbzufonxd8ffk44cb.webp?k=IgAAAAAAAAAE',
            },
            {
                storyId: 1,
                sourceUrl:
                    'https://cdn.inappstory.ru/file/ur/uq/le/9ufzwtpdjeekidqq04alfnxvu2.webp?k=IgAAAAAAAAAE',
            },
            {
                storyId: 1,
                sourceUrl:
                    'https://cdn.inappstory.ru/file/sy/vl/c7/uyqzmdojadcbw7o0a35ojxlcul.webp?k=IgAAAAAAAAAE',
            },
        ],
    });
}

async function down() {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
}

async function main() {
    try {
        await down();
        await up();
    } catch (e) {
        console.error(e);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
