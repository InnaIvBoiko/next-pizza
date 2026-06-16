import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prismaClientSingleton = () => {
    const adapter = new PrismaPg({
        connectionString: `${process.env.POSTGRES_URL}`,
    });
    return new PrismaClient({ adapter });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Reuse the client across hot reloads in dev so repeated module evaluation
// doesn't open a new connection pool each time. In production each instance
// gets its own client.
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
}
