import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { UserRole } from '@/generated/prisma/enums';
import { hashSync } from 'bcrypt';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Fields safe to expose: everything except the password hash.
const PUBLIC_USER_FIELDS = {
    id: true,
    fullName: true,
    email: true,
    role: true,
    verified: true,
    provider: true,
    createdAt: true,
    updatedAt: true,
} as const;

/**
 * Two-tier guard for this admin-only resource: 401 when not signed in,
 * 403 when signed in without the ADMIN role.
 */
async function requireAdmin() {
    const user = await getUserSession();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== UserRole.ADMIN) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return null;
}

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        const users = await prisma.user.findMany({
            select: PUBLIC_USER_FIELDS,
        });
        return NextResponse.json(users);
    } catch (error: unknown) {
        const details = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Could not retrieve users', details },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    let data;
    try {
        data = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate the incoming payload — never trust the request body.
    const fullName =
        typeof data?.fullName === 'string' ? data.fullName.trim() : '';
    const email =
        typeof data?.email === 'string' ? data.email.trim().toLowerCase() : '';
    const password = typeof data?.password === 'string' ? data.password : '';
    const role = data?.role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER;

    const errors: Record<string, string> = {};
    if (fullName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters long.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'A valid email is required.';
    }
    if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
    }

    if (Object.keys(errors).length > 0) {
        return NextResponse.json(
            { error: 'Validation failed', errors },
            { status: 400 }
        );
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json(
                { error: 'A user with this email already exists.' },
                { status: 409 }
            );
        }

        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                role,
                // Always store a hash, never the raw password.
                password: hashSync(password, 10),
            },
            select: PUBLIC_USER_FIELDS,
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error: unknown) {
        const details = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Could not create user', details },
            { status: 500 }
        );
    }
}
