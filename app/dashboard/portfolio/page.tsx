'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, MoreHorizontal, Edit, Trash2, Star, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { cn } from '@/lib/utils';

interface MockPortfolio {
  id: string;
  title: string;
  category: string;
  status: string;
  featured: boolean;
  image: string;
}

const mockPortfolio: MockPortfolio[] = [
  { id: '1', title: 'E-Commerce Platform', category: 'Web Development', status: 'COMPLETED', featured: true, image: 'gradient' },
  { id: '2', title: 'AI Chatbot Solution', category: 'AI & Automation', status: 'COMPLETED', featured: true, image: 'gradient' },
  { id: '3', title: 'Healthcare Dashboard', category: 'Enterprise', status: 'COMPLETED', featured: false, image: 'gradient' },
  { id: '4', title: 'Finance Mobile App', category: 'Mobile', status: 'COMPLETED', featured: false, image: 'gradient' },
  { id: '5', title: 'Marketing Website', category: 'Web Development', status: 'COMPLETED', featured: true, image: 'gradient' },
  { id: '6', title: 'Analytics Platform', category: 'Enterprise', status: 'COMPLETED', featured: false, image: 'gradient' },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        description="Manage your public portfolio showcase."
        action={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add to Portfolio
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Items" value={mockPortfolio.length} icon={Briefcase} accent="primary" />
        <StatCard title="Featured" value={mockPortfolio.filter((p) => p.featured).length} icon={Star} accent="warning" />
        <StatCard title="Categories" value={new Set(mockPortfolio.map((p) => p.category)).size} icon={Briefcase} accent="accent" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockPortfolio.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="group overflow-hidden transition-all hover:shadow-soft-md">
              <div className="relative h-40 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10">
                <div className="absolute inset-0 bg-grid-sm opacity-30" />
                <div className="absolute right-3 top-3 flex gap-1.5">
                  {item.featured && (
                    <Badge variant="secondary" className="gap-1 bg-amber-500/90 text-white">
                      <Star className="h-2.5 w-2.5 fill-white" /> Featured
                    </Badge>
                  )}
                </div>
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer gap-2"><Eye className="h-3.5 w-3.5" /> View</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2"><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
                <Badge variant="secondary" className={cn('mt-3 text-[10px]', 'bg-success/10 text-success')}>
                  {item.status}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
