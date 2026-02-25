/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint and TypeScript errors during Vercel builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'sandbox.getsafepay.com',
      },
      {
        protocol: 'https',
        hostname: 'getsafepay.com',
      },
    ],
  },
  transpilePackages: ['three'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

module.exports = nextConfig
