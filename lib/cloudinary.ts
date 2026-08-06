import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ALLOWED_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'svg'] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

type AllowedFormat = (typeof ALLOWED_FORMATS)[number];

type UploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
};

function validateFile(file: File): { format: string; buffer: Buffer } {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10 MB limit');
  }

  const format = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_FORMATS.includes(format as AllowedFormat)) {
    throw new Error(`File format ${format} is not supported. Allowed: ${ALLOWED_FORMATS.join(', ')}`);
  }

  return { format, buffer: Buffer.from([]) };
}

export async function uploadImage(
  file: File,
  folder = 'hyaska'
): Promise<UploadResult> {
  const { format } = validateFile(file);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<UploadResult>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          format: format === 'jpg' ? 'jpg' : format,
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Upload failed'));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      )
      .end(buffer);
  });

  return result;
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  const parts: string[] = [
    `q_${options.quality ?? 'auto'}`,
    'f_auto',
  ];
  if (options.width) parts.push(`w_${options.width}`);
  if (options.height) parts.push(`h_${options.height}`);

  return cloudinary.url(publicId, { transformation: parts.join(',') });
}

export { cloudinary };
