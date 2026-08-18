// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/api/upload/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'hyaska';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, folder);

    // Every upload — from any editor across the dashboard (blog, projects,
    // services, profile avatars, ...) — populates the real Media Library.
    // Never let a Media row failure undo an already-succeeded Cloudinary
    // upload; log and still return the upload result.
    try {
      await prisma.media.create({
        data: {
          url: result.url,
          publicId: result.publicId,
          folder,
          fileType: result.format,
          width: result.width,
          height: result.height,
          size: result.bytes,
          title: result.originalFilename,
          uploadedById: user.id,
        },
      });
    } catch (mediaError) {
      console.error('[upload] failed to create Media record:', mediaError);
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
