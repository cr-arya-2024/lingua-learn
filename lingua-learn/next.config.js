/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'localhost:5000',
        '*.pike.replit.dev',
        '*.replit.dev',
        '34d62473-57a4-4c1f-aee9-f23d739b05bd-00-2g7od597v0dks.pike.replit.dev',
        '34d62473-57a4-4c1f-aee9-f23d739b05bd-00-2g7od597v0dks.pike.replit.dev:5000'
      ]
    }
  }
};

module.exports = nextConfig;
