// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/api/upload/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { requireAuth } from '@/lib/dashboard-auth';

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

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
