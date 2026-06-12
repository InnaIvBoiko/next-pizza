import { UserRole } from '@/generated/prisma/client';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface User {
        id: string;
        role: UserRole;
    }

    interface Session {
        user: User;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: UserRole;
        fullName?: string;
    }
}
