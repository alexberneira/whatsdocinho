/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // Configuração para API Routes - remover rewrites que podem causar conflito
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/hallo/:path*',
  //       destination: '/api/hallo',
  //     },
  //   ];
  // },
}

module.exports = nextConfig 