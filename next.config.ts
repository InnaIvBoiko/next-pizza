import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Keep Pino (and its pino-pretty transport) out of the server bundle. Pino
    // spawns worker threads via file paths, which break when bundled.
    serverExternalPackages: ['pino', 'pino-pretty'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.dodostatic.net',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
        ],
    },
};

export default nextConfig;
