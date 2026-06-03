import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

// import { PrismaClient } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';

// const prismaClientSingleton = () => {
//     const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
//     return new PrismaClient({ adapter });
// };

// declare global {
//     var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
// }

// export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
