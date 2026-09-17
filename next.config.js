/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.fbcdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'scontent.xx.fbcdn.net', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;

// Deploy trigger: no runtime or visual change.
