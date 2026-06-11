import path from 'node:path';
import { defineConfig } from 'prisma/config';

// Prisma 7 no longer auto-loads .env in the config file.
// On platforms like Vercel there is no .env file (env vars are injected
// directly), so loading is best-effort.
try {
  process.loadEnvFile();
} catch {
  // no .env file present — rely on the existing process.env
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Use process.env directly (not prisma's env()) so `prisma generate`
    // doesn't throw when POSTGRES_URL is absent at build time (e.g. on Vercel,
    // where the client is generated via postinstall). The URL is only needed
    // for CLI commands that actually connect (migrate, studio, db seed); the
    // runtime client builds its own connection in prisma/prisma-client.ts.
    url: process.env.POSTGRES_URL ?? '',
  },
});
