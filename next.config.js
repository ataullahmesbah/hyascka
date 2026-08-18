// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: next.config.js
// ==========================================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      // /service was a duplicate of the canonical /services catalog —
      // consolidated. These redirects catch any bookmarks/external links.
      { source: '/service', destination: '/services', permanent: true },
      { source: '/service/:slug', destination: '/services/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;