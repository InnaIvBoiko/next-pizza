import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Only in-stock ingredients are offered as menu filters (out-of-stock
        // ones are managed in the dashboard "Scorte" page).
        const ingredients = await prisma.ingredient.findMany({
            where: { available: true },
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(ingredients);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                {
                    error: 'Could not fetch ingredients',
                    details: error.message,
                },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Could not fetch ingredients', details: 'Unknown error' },
            { status: 500 }
        );
    }
}
