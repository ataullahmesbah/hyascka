import { FolderKanban, Users, Globe, Workflow, Smile } from 'lucide-react';
import type { Stat } from '@/types';

export const stats: Stat[] = [
  { value: 120, suffix: '+', label: 'Projects Completed', icon: FolderKanban },
  { value: 80, suffix: '+', label: 'Clients Served', icon: Users },
  { value: 25, suffix: '+', label: 'Countries', icon: Globe },
  { value: 300, suffix: '+', label: 'AI Workflows', icon: Workflow },
  { value: 98, suffix: '%', label: 'Customer Satisfaction', icon: Smile },
];

export const resultsSummary = [
  { value: '120+', label: 'Systems shipped' },
  { value: '3.4x', label: 'Avg. efficiency gain' },
  { value: '98%', label: 'Client satisfaction' },
  { value: '25+', label: 'Countries served' },
];
