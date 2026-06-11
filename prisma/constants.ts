export const categories = [
    { name: 'Pizzas' },
    { name: 'Combos' },
    { name: 'Appetizers' },
    { name: 'Cocktails' },
    { name: 'Coffee' },
    { name: 'Beverages' },
];

export const _ingredients = [
    {
        name: 'Cheese crust',
        price: 2.5,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/99f5cb91225b4875bd06a26d2e842106.png',
    },
    {
        name: 'Creamy mozzarella',
        price: 1.5,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/cdea869ef287426386ed634e6099a5ba.png',
    },
    {
        name: 'Cheddar and parmesan cheeses',
        price: 1.5,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA69C1FE796',
    },
    {
        name: 'Spicy jalapeño peppers',
        price: 1,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/11ee95b6bfdf98fb88a113db92d7b3df.png',
    },
    {
        name: 'Tender chicken',
        price: 1.8,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA5B328D35A',
    },
    {
        name: 'Mushrooms',
        price: 1,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA67259A324',
    },
    {
        name: 'Ham',
        price: 1.5,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA61B9A8D61',
    },
    {
        name: 'Spicy pepperoni',
        price: 1.5,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA6258199C3',
    },
    {
        name: 'Spicy chorizo',
        price: 1.8,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA62D5D6027',
    },
    {
        name: 'Pickled cucumbers',
        price: 0.9,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A21DA51A81211E9EA89958D782B',
    },
    {
        name: 'Fresh tomatoes',
        price: 0.9,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA7AC1A1D67',
    },
    {
        name: 'Red onion',
        price: 0.8,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA60AE6464C',
    },
    {
        name: 'Juicy pineapples',
        price: 1.2,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A21DA51A81211E9AFA6795BA2A0',
    },
    {
        name: 'Italian herbs',
        price: 0.5,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/370dac9ed21e4bffaf9bc2618d258734.png',
    },
    {
        name: 'Sweet pepper',
        price: 1,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA63F774C1B',
    },
    {
        name: 'Feta cheese cubes',
        price: 1.5,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA6B0FFC349',
    },
    {
        name: 'Meatballs',
        price: 1.8,
        imageUrl:
            'https://cdn.dodostatic.net/static/Img/Ingredients/b2f3a5d5afe44516a93cfc0d2ee60088.png',
    },
].map((obj, index) => ({ id: index + 1, ...obj }));

// Reusable dodostatic image URLs (next.config only allows **.dodostatic.net).
const IMG = {
    pizza: 'https://media.dodostatic.net/image/r:233x233/11EE7D61304FAF5A98A6958F2BB2D260.webp',
    pizzaCheese:
        'https://media.dodostatic.net/image/r:233x233/11EE7D610CF7E265B7C72BE5AE757CA7.webp',
    denwich:
        'https://media.dodostatic.net/image/r:292x292/11EE796FF0059B799A17F57A9E64C725.webp',
    nuggets:
        'https://media.dodostatic.net/image/r:292x292/11EE7D618B5C7EC29350069AE9532C6E.webp',
    potatoes:
        'https://media.dodostatic.net/image/r:292x292/11EED646A9CD324C962C6BEA78124F19.webp',
    dodster:
        'https://media.dodostatic.net/image/r:292x292/11EE796F96D11392A2F6DD73599921B9.webp',
    bananaShake:
        'https://media.dodostatic.net/image/r:292x292/11EEE20B8772A72A9B60CFB20012C185.webp',
    appleShake:
        'https://media.dodostatic.net/image/r:292x292/11EE79702E2A22E693D96133906FB1B8.webp',
    oreoShake:
        'https://media.dodostatic.net/image/r:292x292/11EE796FA1F50F8F8111A399E4C1A1E3.webp',
    classicShake:
        'https://media.dodostatic.net/image/r:292x292/11EE796F93FB126693F96CB1D3E403FB.webp',
    irishCappuccino:
        'https://media.dodostatic.net/image/r:292x292/11EE7D61999EBDA59C10E216430A6093.webp',
    caramelCappuccino:
        'https://media.dodostatic.net/image/r:292x292/11EE7D61AED6B6D4BFDAD4E58D76CF56.webp',
    coconutLatte:
        'https://media.dodostatic.net/image/r:292x292/11EE7D61B19FA07090EE88B0ED347F42.webp',
    americano:
        'https://media.dodostatic.net/image/r:292x292/11EE7D61B044583596548A59078BBD33.webp',
    latte: 'https://media.dodostatic.net/image/r:292x292/11EE7D61B0C26A3F85D97A78FEEE00AD.webp',
};

// Non-pizza products. `price` drives a single ProductItem per product (these
// have no size/type selector in the UI). Pizzas are created separately in
// seed.ts because they need ingredient relations and 3 sizes × 2 doughs.
// categoryId: 2 Combos, 3 Appetizers, 4 Cocktails, 5 Coffee, 6 Beverages.
const productList = [
    // --- Combos ---
    { name: 'Menu Margherita (pizza + bibita)', imageUrl: IMG.pizza, categoryId: 2, price: 9 },
    { name: 'Menu Diavola (pizza + birra)', imageUrl: IMG.pizza, categoryId: 2, price: 12 },
    { name: 'Combo Coppia (2 pizze + 2 bibite)', imageUrl: IMG.pizzaCheese, categoryId: 2, price: 20 },
    { name: 'Combo Famiglia (3 pizze + bibita 1.5L)', imageUrl: IMG.pizzaCheese, categoryId: 2, price: 30 },

    // --- Appetizers / Aperitivo ---
    { name: 'Bruschette al pomodoro', imageUrl: IMG.denwich, categoryId: 3, price: 5 },
    { name: 'Tagliere di salumi e formaggi', imageUrl: IMG.denwich, categoryId: 3, price: 12 },
    { name: 'Supplì al telefono', imageUrl: IMG.nuggets, categoryId: 3, price: 4.5 },
    { name: 'Arancini siciliani', imageUrl: IMG.nuggets, categoryId: 3, price: 5 },
    { name: 'Olive ascolane', imageUrl: IMG.nuggets, categoryId: 3, price: 5.5 },
    { name: 'Crocchette di patate', imageUrl: IMG.potatoes, categoryId: 3, price: 4.5 },
    { name: 'Caprese di bufala', imageUrl: IMG.dodster, categoryId: 3, price: 8 },
    { name: 'Frittura di calamari', imageUrl: IMG.nuggets, categoryId: 3, price: 9 },

    // --- Cocktails ---
    { name: 'Aperol Spritz', imageUrl: IMG.appleShake, categoryId: 4, price: 6 },
    { name: 'Negroni', imageUrl: IMG.bananaShake, categoryId: 4, price: 8 },
    { name: 'Hugo Spritz', imageUrl: IMG.classicShake, categoryId: 4, price: 6.5 },
    { name: 'Americano', imageUrl: IMG.bananaShake, categoryId: 4, price: 7 },
    { name: 'Negroni Sbagliato', imageUrl: IMG.appleShake, categoryId: 4, price: 7.5 },
    { name: 'Bellini', imageUrl: IMG.classicShake, categoryId: 4, price: 7 },
    { name: 'Mojito', imageUrl: IMG.oreoShake, categoryId: 4, price: 7 },

    // --- Coffee ---
    { name: 'Espresso', imageUrl: IMG.americano, categoryId: 5, price: 1.2 },
    { name: 'Caffè macchiato', imageUrl: IMG.caramelCappuccino, categoryId: 5, price: 1.4 },
    { name: 'Cappuccino', imageUrl: IMG.caramelCappuccino, categoryId: 5, price: 1.5 },
    { name: 'Caffè latte', imageUrl: IMG.latte, categoryId: 5, price: 1.8 },
    { name: 'Marocchino', imageUrl: IMG.coconutLatte, categoryId: 5, price: 1.8 },
    { name: 'Latte macchiato', imageUrl: IMG.latte, categoryId: 5, price: 2 },
    { name: 'Caffè corretto', imageUrl: IMG.irishCappuccino, categoryId: 5, price: 2 },

    // --- Beverages ---
    { name: 'Acqua naturale 0.5L', imageUrl: IMG.classicShake, categoryId: 6, price: 1 },
    { name: 'Acqua frizzante 0.5L', imageUrl: IMG.classicShake, categoryId: 6, price: 1 },
    { name: 'Coca-Cola 0.33L', imageUrl: IMG.oreoShake, categoryId: 6, price: 2.5 },
    { name: 'Aranciata San Pellegrino', imageUrl: IMG.appleShake, categoryId: 6, price: 2.5 },
    { name: 'Chinotto', imageUrl: IMG.oreoShake, categoryId: 6, price: 2.5 },
    { name: 'Limonata', imageUrl: IMG.classicShake, categoryId: 6, price: 2.5 },
    { name: 'Birra Moretti 0.33L', imageUrl: IMG.bananaShake, categoryId: 6, price: 3.5 },
    { name: 'Birra Peroni 0.33L', imageUrl: IMG.bananaShake, categoryId: 6, price: 3.5 },
];

// Stripped of `price` for prisma.createMany (the Product table has no price);
// prices are applied via ProductItem rows in seed.ts.
export const products = productList.map(({ price: _price, ...rest }) => rest);
export const productPrices = productList.map(p => p.price);

// --- Pizzas (categoryId 1) ---
// base = price of a 30 cm traditional pizza; 20/30/40 cm are derived in seed.ts.
export const pizzas = [
    { name: 'Margherita', imageUrl: IMG.pizzaCheese, base: 6, ingredients: [2, 11, 14] },
    { name: 'Marinara', imageUrl: IMG.pizza, base: 5.5, ingredients: [11, 12, 14] },
    { name: 'Diavola', imageUrl: IMG.pizza, base: 8, ingredients: [2, 8, 4] },
    { name: 'Quattro Formaggi', imageUrl: IMG.pizzaCheese, base: 9, ingredients: [1, 2, 3, 16] },
    { name: 'Quattro Stagioni', imageUrl: IMG.pizza, base: 8.5, ingredients: [2, 7, 6, 11] },
    { name: 'Capricciosa', imageUrl: IMG.pizza, base: 8.5, ingredients: [2, 7, 6, 15] },
    { name: 'Prosciutto e Funghi', imageUrl: IMG.pizzaCheese, base: 8, ingredients: [2, 7, 6] },
    { name: 'Napoli', imageUrl: IMG.pizza, base: 7, ingredients: [2, 11, 14] },
    { name: 'Bufalina', imageUrl: IMG.pizzaCheese, base: 9.5, ingredients: [2, 11, 16, 14] },
    { name: 'Ortolana', imageUrl: IMG.pizza, base: 7.5, ingredients: [6, 15, 12, 11] },
];
