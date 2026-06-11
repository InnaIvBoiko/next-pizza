import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.dodostatic.net',
            },
        ],
    },
};

export default nextConfig;
