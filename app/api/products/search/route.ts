import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query') ?? '';

    try {
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            take: 5,
        });

        return NextResponse.json(products);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: 'Could not search products', details: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Could not search products', details: 'Unknown error' },
            { status: 500 }
        );
    }
}
