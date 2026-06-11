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

// Real product photos from Wikimedia Commons (allowed in next.config).
const W = 'https://upload.wikimedia.org/wikipedia/commons';
const IMG = {
    // Pizzas
    margherita: `${W}/thumb/c/c8/Pizza_Margherita_stu_spivack.jpg/500px-Pizza_Margherita_stu_spivack.jpg`,
    marinara: `${W}/thumb/1/11/Pizza_marinara.jpg/500px-Pizza_marinara.jpg`,
    diavola: `${W}/thumb/0/0c/Pepperoni_Pizza_%2829204589095%29.jpg/500px-Pepperoni_Pizza_%2829204589095%29.jpg`,
    quattroFormaggi: `${W}/thumb/5/5b/%D0%98%D1%82%D0%B0%D0%BB%D0%B8%D1%8F_4_%D1%81%D1%8B%D1%80_%D0%BF%D0%B8%D1%86%D1%86%D0%B0%D1%81%D1%8B.jpg/500px-%D0%98%D1%82%D0%B0%D0%BB%D0%B8%D1%8F_4_%D1%81%D1%8B%D1%80_%D0%BF%D0%B8%D1%86%D1%86%D0%B0%D1%81%D1%8B.jpg`,
    quattroStagioni: `${W}/thumb/4/42/Pizza_Quattro_Stagioni_transparent.png/500px-Pizza_Quattro_Stagioni_transparent.png`,
    capricciosa: `${W}/thumb/2/2a/Pizza_capricciosa.jpg/500px-Pizza_capricciosa.jpg`,
    prosciuttoFunghi: `${W}/thumb/e/eb/White_cheese_pizza.jpg/500px-White_cheese_pizza.jpg`,
    napoli: `${W}/thumb/5/57/Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg/500px-Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg`,
    bufalina: `${W}/thumb/5/57/Mozzarella_di_bufala3.jpg/500px-Mozzarella_di_bufala3.jpg`,
    pizzaGeneric: `${W}/thumb/9/91/Pizza-3007395.jpg/500px-Pizza-3007395.jpg`,
    calzone: `${W}/thumb/2/20/Wikimania_2016_Deryck_day_0_-_07_calzone.jpg/500px-Wikimania_2016_Deryck_day_0_-_07_calzone.jpg`,
    // Appetizers
    bruschetta: `${W}/thumb/1/1f/2014_Bruschetta_The_Larder_Chiang_Mai.jpg/500px-2014_Bruschetta_The_Larder_Chiang_Mai.jpg`,
    antipasto: `${W}/thumb/6/62/01_antipasti.jpg/500px-01_antipasti.jpg`,
    suppli: `${W}/thumb/a/a9/Suppl%C3%AC.jpg/500px-Suppl%C3%AC.jpg`,
    arancini: `${W}/thumb/e/ee/Arancini_002.jpg/500px-Arancini_002.jpg`,
    oliveAscolane: `${W}/thumb/1/10/Olive_all%27ascolana.jpg/500px-Olive_all%27ascolana.jpg`,
    crocchette: `${W}/thumb/b/b4/Croquetas_Caseras_%287068664101%29.jpg/500px-Croquetas_Caseras_%287068664101%29.jpg`,
    caprese: `${W}/thumb/b/b1/Caprese-1_%28tigher_crop%29.jpg/500px-Caprese-1_%28tigher_crop%29.jpg`,
    frittura: `${W}/thumb/a/a2/Italy-Italia_Italian_Food_Fritto_misto_alla_piemontese_PxT.JPG/500px-Italy-Italia_Italian_Food_Fritto_misto_alla_piemontese_PxT.JPG`,
    // Cocktails
    aperol: `${W}/thumb/5/5f/Aperol_Spritz_aboard_Viking_Mariella.jpg/500px-Aperol_Spritz_aboard_Viking_Mariella.jpg`,
    negroni: `${W}/thumb/e/ea/C%C3%B3ctel_Negroni_Campari.jpg/500px-C%C3%B3ctel_Negroni_Campari.jpg`,
    hugo: `${W}/thumb/b/b3/15-09-26-RalfR-WLC-0059.jpg/500px-15-09-26-RalfR-WLC-0059.jpg`,
    americano: `${W}/thumb/2/2b/Americano_cocktail_at_Nightwood_Restaurant.jpg/500px-Americano_cocktail_at_Nightwood_Restaurant.jpg`,
    bellini: `${W}/thumb/d/d5/Bellini_Cipriani%2C_Macaroni_Grill%2C_Dunwoody_GA.jpg/500px-Bellini_Cipriani%2C_Macaroni_Grill%2C_Dunwoody_GA.jpg`,
    mojito: `${W}/thumb/5/54/15-09-26-RalfR-WLC-0072.jpg/500px-15-09-26-RalfR-WLC-0072.jpg`,
    // Coffee
    espresso: `${W}/thumb/a/a5/Tazzina_di_caff%C3%A8_a_Ventimiglia.jpg/500px-Tazzina_di_caff%C3%A8_a_Ventimiglia.jpg`,
    macchiato: `${W}/thumb/f/fc/Macchiato_%287199366530%29.jpg/500px-Macchiato_%287199366530%29.jpg`,
    cappuccino: `${W}/thumb/7/70/Cappuccino_in_original.jpg/500px-Cappuccino_in_original.jpg`,
    caffeLatte: `${W}/thumb/d/d8/Caffe_Latte_at_Pulse_Cafe.jpg/500px-Caffe_Latte_at_Pulse_Cafe.jpg`,
    marocchino: `${W}/thumb/c/c2/Marocchino_%2826440403402%29.jpg/500px-Marocchino_%2826440403402%29.jpg`,
    latteMacchiato: `${W}/thumb/6/61/Latte_macchiato_with_coffee_beans.jpg/500px-Latte_macchiato_with_coffee_beans.jpg`,
    corretto: `${W}/thumb/3/3c/Caff%C3%A8_corretto.jpg/500px-Caff%C3%A8_corretto.jpg`,
    // Beverages
    water: `${W}/0/02/Stilles_Mineralwasser.jpg`,
    cola: `${W}/thumb/2/27/Coca_Cola_Flasche_-_Original_Taste.jpg/500px-Coca_Cola_Flasche_-_Original_Taste.jpg`,
    aranciata: `${W}/thumb/6/6a/Orangeade.jpg/500px-Orangeade.jpg`,
    chinotto: `${W}/thumb/8/8d/Citrus_myrtifolia_2.jpg/500px-Citrus_myrtifolia_2.jpg`,
    limonata: `${W}/thumb/1/10/Lemonade_-_27682817724.jpg/500px-Lemonade_-_27682817724.jpg`,
    moretti: `${W}/thumb/3/32/Birra_Moretti_Logo_2023.png/500px-Birra_Moretti_Logo_2023.png`,
    peroni: `${W}/thumb/9/9a/Beer_wuerzburger_hofbraue.jpg/500px-Beer_wuerzburger_hofbraue.jpg`,
};

// Non-pizza products. `price` drives a single ProductItem per product (these
// have no size/type selector in the UI). Pizzas are created separately in
// seed.ts because they need ingredient relations and 3 sizes × 2 doughs.
// categoryId: 2 Combos, 3 Appetizers, 4 Cocktails, 5 Coffee, 6 Beverages.
const productList = [
    // --- Combos ---
    { name: 'Menu Margherita (pizza + bibita)', imageUrl: IMG.margherita, categoryId: 2, price: 9 },
    { name: 'Menu Diavola (pizza + birra)', imageUrl: IMG.diavola, categoryId: 2, price: 12 },
    { name: 'Combo Coppia (2 pizze + 2 bibite)', imageUrl: IMG.pizzaGeneric, categoryId: 2, price: 20 },
    { name: 'Combo Famiglia (3 pizze + bibita 1.5L)', imageUrl: IMG.calzone, categoryId: 2, price: 30 },

    // --- Appetizers / Aperitivo ---
    { name: 'Bruschette al pomodoro', imageUrl: IMG.bruschetta, categoryId: 3, price: 5 },
    { name: 'Tagliere di salumi e formaggi', imageUrl: IMG.antipasto, categoryId: 3, price: 12 },
    { name: 'Supplì al telefono', imageUrl: IMG.suppli, categoryId: 3, price: 4.5 },
    { name: 'Arancini siciliani', imageUrl: IMG.arancini, categoryId: 3, price: 5 },
    { name: 'Olive ascolane', imageUrl: IMG.oliveAscolane, categoryId: 3, price: 5.5 },
    { name: 'Crocchette di patate', imageUrl: IMG.crocchette, categoryId: 3, price: 4.5 },
    { name: 'Caprese di bufala', imageUrl: IMG.caprese, categoryId: 3, price: 8 },
    { name: 'Frittura di calamari', imageUrl: IMG.frittura, categoryId: 3, price: 9 },

    // --- Cocktails ---
    { name: 'Aperol Spritz', imageUrl: IMG.aperol, categoryId: 4, price: 6 },
    { name: 'Negroni', imageUrl: IMG.negroni, categoryId: 4, price: 8 },
    { name: 'Hugo Spritz', imageUrl: IMG.hugo, categoryId: 4, price: 6.5 },
    { name: 'Americano', imageUrl: IMG.americano, categoryId: 4, price: 7 },
    { name: 'Negroni Sbagliato', imageUrl: IMG.negroni, categoryId: 4, price: 7.5 },
    { name: 'Bellini', imageUrl: IMG.bellini, categoryId: 4, price: 7 },
    { name: 'Mojito', imageUrl: IMG.mojito, categoryId: 4, price: 7 },

    // --- Coffee ---
    { name: 'Espresso', imageUrl: IMG.espresso, categoryId: 5, price: 1.2 },
    { name: 'Caffè macchiato', imageUrl: IMG.macchiato, categoryId: 5, price: 1.4 },
    { name: 'Cappuccino', imageUrl: IMG.cappuccino, categoryId: 5, price: 1.5 },
    { name: 'Caffè latte', imageUrl: IMG.caffeLatte, categoryId: 5, price: 1.8 },
    { name: 'Marocchino', imageUrl: IMG.marocchino, categoryId: 5, price: 1.8 },
    { name: 'Latte macchiato', imageUrl: IMG.latteMacchiato, categoryId: 5, price: 2 },
    { name: 'Caffè corretto', imageUrl: IMG.corretto, categoryId: 5, price: 2 },

    // --- Beverages ---
    { name: 'Acqua naturale 0.5L', imageUrl: IMG.water, categoryId: 6, price: 1 },
    { name: 'Acqua frizzante 0.5L', imageUrl: IMG.water, categoryId: 6, price: 1 },
    { name: 'Coca-Cola 0.33L', imageUrl: IMG.cola, categoryId: 6, price: 2.5 },
    { name: 'Aranciata San Pellegrino', imageUrl: IMG.aranciata, categoryId: 6, price: 2.5 },
    { name: 'Chinotto', imageUrl: IMG.chinotto, categoryId: 6, price: 2.5 },
    { name: 'Limonata', imageUrl: IMG.limonata, categoryId: 6, price: 2.5 },
    { name: 'Birra Moretti 0.33L', imageUrl: IMG.moretti, categoryId: 6, price: 3.5 },
    { name: 'Birra Peroni 0.33L', imageUrl: IMG.peroni, categoryId: 6, price: 3.5 },
];

// Stripped of `price` for prisma.createMany (the Product table has no price);
// prices are applied via ProductItem rows in seed.ts.
export const products = productList.map(({ price: _price, ...rest }) => rest);
export const productPrices = productList.map(p => p.price);

// --- Pizzas (categoryId 1) ---
// base = price of a 30 cm traditional pizza; 20/30/40 cm are derived in seed.ts.
export const pizzas = [
    { name: 'Margherita', imageUrl: IMG.margherita, base: 6, ingredients: [2, 11, 14] },
    { name: 'Marinara', imageUrl: IMG.marinara, base: 5.5, ingredients: [11, 12, 14] },
    { name: 'Diavola', imageUrl: IMG.diavola, base: 8, ingredients: [2, 8, 4] },
    { name: 'Quattro Formaggi', imageUrl: IMG.quattroFormaggi, base: 9, ingredients: [1, 2, 3, 16] },
    { name: 'Quattro Stagioni', imageUrl: IMG.quattroStagioni, base: 8.5, ingredients: [2, 7, 6, 11] },
    { name: 'Capricciosa', imageUrl: IMG.capricciosa, base: 8.5, ingredients: [2, 7, 6, 15] },
    { name: 'Prosciutto e Funghi', imageUrl: IMG.prosciuttoFunghi, base: 8, ingredients: [2, 7, 6] },
    { name: 'Napoli', imageUrl: IMG.napoli, base: 7, ingredients: [2, 11, 14] },
    { name: 'Bufalina', imageUrl: IMG.bufalina, base: 9.5, ingredients: [2, 11, 16, 14] },
    { name: 'Ortolana', imageUrl: IMG.pizzaGeneric, base: 7.5, ingredients: [6, 15, 12, 11] },
];
