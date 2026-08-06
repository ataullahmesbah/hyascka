'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Image, Upload, MoreHorizontal, Trash2, Copy, Eye, Search, Folder } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';

const mockFolders = ['All', 'Blog', 'Projects', 'Services', 'Hero', 'Team'];

const mockMedia = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  name: `image-${i + 1}.jpg`,
  size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
  folder: mockFolders[(i % mockFolders.length) === 0 ? 1 : (i % mockFolders.length)],
  gradient: `from-primary/${15 + i * 5} via-accent/${10 + i * 3} to-primary/${5 + i * 2}`,
}));

export default function MediaPage() {
  const [activeFolder, setActiveFolder] = React.useState('All');
  const [search, setSearch] = React.useState('');

  const filtered = mockMedia.filter((m) => {
    const matchesFolder = activeFolder === 'All' || m.folder === activeFolder;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Upload and manage images via Cloudinary."
        action={
          <Button size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Files" value={mockMedia.length} icon={Image} accent="primary" />
        <StatCard title="Folders" value={mockFolders.length - 1} icon={Folder} accent="accent" />
        <StatCard title="Storage Used" value="124 MB" icon={Image} accent="success" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search media..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
              {mockFolders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeFolder === folder ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {folder}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filtered.map((media, i) => (
              <motion.div
                key={media.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="group relative overflow-hidden rounded-xl border border-border"
              >
                <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${media.gradient}`}>
                  <Image className="h-8 w-8 text-foreground/30" />
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="secondary" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8"><Copy className="h-3.5 w-3.5" /></Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium">{media.name}</p>
                  <p className="text-[10px] text-muted-foreground">{media.size}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
