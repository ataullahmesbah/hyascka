'use client';
// ==========================================================
// NEW FILE
// LOCATION: components/dashboard/image-upload.tsx
// ==========================================================

import * as React from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import cloudinaryImageLoader from '@/lib/cloudinary-image-loader';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

/**
 * File upload (via /api/upload → Cloudinary) with a manual-URL fallback,
 * so dashboard editors (blog, projects, ...) aren't limited to pasting a
 * URL someone already hosted elsewhere. Shared rather than duplicated per
 * editor — see app/dashboard/blog and app/dashboard/projects.
 */
export function ImageUpload({ value, onChange, folder = 'hyaska', label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Upload failed');
      }

      const result = await res.json();
      onChange(result.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-secondary/40">
          <Image src={value} alt={label} fill loader={cloudinaryImageLoader} className="object-cover" />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={() => onChange('')}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload a file"
          className="flex-1"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = '';
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="shrink-0 gap-2"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
        </Button>
      </div>
    </div>
  );
}
