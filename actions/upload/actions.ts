'use server';

import { uploadImage } from '@/lib/cloudinary';

type UploadResult = { success: boolean; error?: string; url?: string; publicId?: string };

export async function uploadFileAction(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'hyaska';

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const result = await uploadImage(file, folder);

    return {
      success: true,
      url: result.url,
      publicId: result.publicId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return { success: false, error: message };
  }
}
