// ==========================================================
// NEW FILE
// LOCATION: lib/cloudinary-image-loader.ts
// ==========================================================
import type { ImageLoaderProps } from 'next/image';

// Cloudinary already serves optimized, CDN-cached images. Routing those
// through Next/Netlify's image optimizer would mean downloading an
// already-optimized image just to re-encode it — so remote (Cloudinary)
// sources get their resize/format/quality params injected directly into
// the Cloudinary URL instead, while local /public assets keep using
// Next's default optimizer (see components/brand-logo.tsx).
const CLOUDINARY_UPLOAD_MARKER = '/image/upload/';

export default function cloudinaryImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.includes('res.cloudinary.com') || !src.includes(CLOUDINARY_UPLOAD_MARKER)) {
    return src;
  }

  const [base, path] = src.split(CLOUDINARY_UPLOAD_MARKER);
  const transform = [`w_${width}`, `q_${quality ?? 'auto'}`, 'f_auto', 'c_limit'].join(',');
  return `${base}${CLOUDINARY_UPLOAD_MARKER}${transform}/${path}`;
}
