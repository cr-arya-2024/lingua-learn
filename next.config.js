/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'localhost:5000',
        '*.pike.replit.dev',
        '*.replit.dev',
      ]
    }
  }
};

module.exports = nextConfig;
