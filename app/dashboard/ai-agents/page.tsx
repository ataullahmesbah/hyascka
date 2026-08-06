'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Bot, Plus, MoreHorizontal, Settings, Trash2, Play, Pause, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface MockAgent {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'PAUSED' | 'IDLE';
  tasks: number;
  successRate: number;
}

const mockAgents: MockAgent[] = [
  { id: '1', name: 'Content Generator', description: 'AI agent for generating blog content and meta descriptions', status: 'ACTIVE', tasks: 1240, successRate: 94 },
  { id: '2', name: 'Customer Support Bot', description: 'Handles initial customer inquiries and FAQs', status: 'ACTIVE', tasks: 3580, successRate: 89 },
  { id: '3', name: 'Lead Qualifier', description: 'Qualifies incoming leads based on criteria', status: 'ACTIVE', tasks: 820, successRate: 91 },
  { id: '4', name: 'Email Automation', description: 'Automates email responses and follow-ups', status: 'PAUSED', tasks: 2100, successRate: 96 },
  { id: '5', name: 'Social Media Poster', description: 'Schedules and posts content to social platforms', status: 'IDLE', tasks: 450, successRate: 98 },
];

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-success/10 text-success',
  PAUSED: 'bg-amber-500/10 text-amber-500',
  IDLE: 'bg-muted text-muted-foreground',
};

const statusIcons: Record<string, typeof Play> = {
  ACTIVE: Play,
  PAUSED: Pause,
  IDLE: Activity,
};

export default function AIAgentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Agents"
        description="Manage your AI-powered automation agents."
        action={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Deploy Agent
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Agents" value={mockAgents.length} icon={Bot} accent="primary" />
        <StatCard title="Active" value={mockAgents.filter((a) => a.status === 'ACTIVE').length} icon={CheckCircle2} accent="success" />
        <StatCard title="Total Tasks" value={mockAgents.reduce((a, ag) => a + ag.tasks, 0).toLocaleString()} icon={Zap} accent="accent" />
        <StatCard title="Avg Success" value={`${(mockAgents.reduce((a, ag) => a + ag.successRate, 0) / mockAgents.length).toFixed(0)}%`} icon={Activity} accent="warning" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockAgents.map((agent, i) => {
          const StatusIcon = statusIcons[agent.status];
          return (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group transition-all hover:shadow-soft-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer gap-2"><Settings className="h-3.5 w-3.5" /> Configure</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          {agent.status === 'ACTIVE' ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Activate</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-medium">{agent.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{agent.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="secondary" className={cn('gap-1.5', statusColors[agent.status])}>
                      <StatusIcon className="h-2.5 w-2.5" />
                      {agent.status.charAt(0) + agent.status.slice(1).toLowerCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{agent.tasks.toLocaleString()} tasks</span>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium">{agent.successRate}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${agent.successRate}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
