// One-off, idempotent: populate Italian translations (nameIt) for existing
// categories and ingredients, matching on the English `name`. Safe to re-run.
// Run with: tsx prisma/translate-content.ts
import { prisma } from './prisma-client';

const categories: Record<string, string> = {
    Pizzas: 'Pizze',
    Combos: 'Combo',
    Appetizers: 'Antipasti',
    Cocktails: 'Cocktail',
    Coffee: 'Caffè',
    Beverages: 'Bevande',
};

const ingredients: Record<string, string> = {
    'Cheese crust': 'Bordo al formaggio',
    'Creamy mozzarella': 'Mozzarella cremosa',
    'Cheddar and parmesan cheeses': 'Cheddar e parmigiano',
    'Spicy jalapeño peppers': 'Jalapeño piccanti',
    'Tender chicken': 'Pollo tenero',
    Mushrooms: 'Funghi',
    Ham: 'Prosciutto cotto',
    'Spicy pepperoni': 'Salamino piccante',
    'Spicy chorizo': 'Chorizo piccante',
    'Pickled cucumbers': 'Cetriolini',
    'Fresh tomatoes': 'Pomodori freschi',
    'Red onion': 'Cipolla rossa',
    'Juicy pineapples': 'Ananas succoso',
    'Italian herbs': 'Erbe italiane',
    'Sweet pepper': 'Peperone dolce',
    'Feta cheese cubes': 'Cubetti di feta',
    Meatballs: 'Polpette',
};

async function main() {
    let cat = 0;
    for (const [name, nameIt] of Object.entries(categories)) {
        const { count } = await prisma.category.updateMany({
            where: { name },
            data: { nameIt },
        });
        cat += count;
    }

    let ing = 0;
    for (const [name, nameIt] of Object.entries(ingredients)) {
        const { count } = await prisma.ingredient.updateMany({
            where: { name },
            data: { nameIt },
        });
        ing += count;
    }

    console.log(`Updated ${cat} categories, ${ing} ingredients.`);
}

main()
    .then(() => prisma.$disconnect())
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
