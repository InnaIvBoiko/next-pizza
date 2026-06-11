import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const ingredients = await prisma.ingredient.findMany();

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
