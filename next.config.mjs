/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;