/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable for Docker builds
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.railway.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'http',
        hostname: 'backend', // Docker network hostname
        port: '3001',
      },
    ],
  },
};

export default nextConfig;
