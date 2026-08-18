// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: next.config.js
// ==========================================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
    // Configured globally (rather than only via the per-<Image> `loader`
    // prop) so Server Components can use next/image with this loader
    // without ever passing the loader function itself as a React prop —
    // passing a plain function as a prop from a Server Component throws
    // "Functions cannot be passed directly to Client Components" in the
    // App Router, since it isn't a Server Action and can't be serialized
    // across that boundary. Client Components may still pass `loader`
    // explicitly if useful; it simply overrides this default for that
    // instance and is unaffected by the issue above.
    loader: 'custom',
    loaderFile: './lib/cloudinary-image-loader.ts',
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