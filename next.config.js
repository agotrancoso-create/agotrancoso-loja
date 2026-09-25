/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [320, 420, 640, 750, 828, 960, 1080, 1200, 1440, 1920, 2048, 3840],
    remotePatterns: [
      { protocol: 'https', hostname: '*.fbcdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'scontent.xx.fbcdn.net', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;

// Publicar a versao refinada — 2026-09-17
