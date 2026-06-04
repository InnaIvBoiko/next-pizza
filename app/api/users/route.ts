import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
    const users = await prisma.user.findMany();

    return NextResponse.json(users);
}

export async function POST(request: Request) {
    let data;
    try {
        data = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON body' },
            { status: 400 }
        );
    }

    try {
        const user = await prisma.user.create({ data });
        return NextResponse.json(user);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: 'Could not create user', details: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Could not create user', details: 'Unknown error' },
            { status: 500 }
        );
    }
}
