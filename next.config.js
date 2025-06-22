/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // Configuração para API Routes
  async rewrites() {
    return [
      {
        source: '/api/hallo/:path*',
        destination: '/api/hallo',
      },
    ];
  },
}

module.exports = nextConfig 