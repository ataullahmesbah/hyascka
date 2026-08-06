'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Workflow, Plus, MoreHorizontal, Play, Pause, Settings, Trash2, Zap, GitBranch } from 'lucide-react';
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

interface MockWorkflow {
  id: string;
  name: string;
  trigger: string;
  steps: number;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  lastRun: string;
}

const mockWorkflows: MockWorkflow[] = [
  { id: '1', name: 'New Lead Notification', trigger: 'Contact form submitted', steps: 4, status: 'ACTIVE', lastRun: '10 min ago' },
  { id: '2', name: 'Blog Publishing Pipeline', trigger: 'Blog post status changed', steps: 6, status: 'ACTIVE', lastRun: '1 hour ago' },
  { id: '3', name: 'User Welcome Sequence', trigger: 'User registered', steps: 3, status: 'ACTIVE', lastRun: '2 hours ago' },
  { id: '4', name: 'Newsletter Distribution', trigger: 'New blog published', steps: 5, status: 'PAUSED', lastRun: '1 day ago' },
  { id: '5', name: 'Support Ticket Routing', trigger: 'Contact message received', steps: 4, status: 'DRAFT', lastRun: 'Never' },
];

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-success/10 text-success',
  PAUSED: 'bg-amber-500/10 text-amber-500',
  DRAFT: 'bg-muted text-muted-foreground',
};

const promptLibrary = [
  { id: '1', name: 'Blog Outline Generator', category: 'Content', uses: 142 },
  { id: '2', name: 'SEO Meta Description', category: 'SEO', uses: 89 },
  { id: '3', name: 'Customer Reply Template', category: 'Support', uses: 256 },
  { id: '4', name: 'Project Summary Writer', category: 'Content', uses: 67 },
  { id: '5', name: 'Social Media Caption', category: 'Marketing', uses: 183 },
];

export default function AutomationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Automation"
        description="Manage workflows and automation pipelines."
        action={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Workflow
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Workflows" value={mockWorkflows.length} icon={Workflow} accent="primary" />
        <StatCard title="Active" value={mockWorkflows.filter((w) => w.status === 'ACTIVE').length} icon={Play} accent="success" />
        <StatCard title="Paused" value={mockWorkflows.filter((w) => w.status === 'PAUSED').length} icon={Pause} accent="warning" />
        <StatCard title="Drafts" value={mockWorkflows.filter((w) => w.status === 'DRAFT').length} icon={GitBranch} accent="accent" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {mockWorkflows.map((workflow, i) => (
            <motion.div key={workflow.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="group transition-all hover:shadow-soft-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Workflow className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium">{workflow.name}</h3>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      <Zap className="mr-1 inline h-3 w-3" />
                      {workflow.trigger}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{workflow.steps} steps</span>
                      <span>Last run: {workflow.lastRun}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn('text-[10px]', statusColors[workflow.status])}>
                      {workflow.status.charAt(0) + workflow.status.slice(1).toLowerCase()}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer gap-2"><Settings className="h-3.5 w-3.5" /> Configure</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          {workflow.status === 'ACTIVE' ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Activate</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Prompt Library</h3>
            <div className="space-y-2">
              {promptLibrary.map((prompt, i) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-secondary"
                >
                  <div>
                    <p className="text-xs font-medium">{prompt.name}</p>
                    <p className="text-[10px] text-muted-foreground">{prompt.category}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{prompt.uses} uses</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
