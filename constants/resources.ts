import {
  BookOpen, FileText, LayoutTemplate, Library, CheckSquare,
  Download, Code2, HelpCircle, Video, PlayCircle,
} from 'lucide-react';
import type { ResourceCategory } from '@/types';

export const resourceCategories: ResourceCategory[] = [
  { icon: BookOpen, title: 'Guides', desc: 'Step-by-step deep dives on building AI systems, from architecture to deployment.', count: '12 guides', href: '/blog' },
  { icon: FileText, title: 'Whitepapers', desc: 'In-depth research and analysis on AI adoption, automation, and enterprise strategy.', count: '5 whitepapers', href: '/blog' },
  { icon: LayoutTemplate, title: 'Templates', desc: 'Ready-to-use project briefs, architecture diagrams, and AI agent specifications.', count: '8 templates', href: '/blog' },
  { icon: Library, title: 'Ebooks', desc: 'Comprehensive handbooks on building production AI agents and automation pipelines.', count: '3 ebooks', href: '/blog' },
  { icon: CheckSquare, title: 'Checklists', desc: 'Pre-launch, security, and AI evaluation checklists to de-risk your deployment.', count: '6 checklists', href: '/blog' },
  { icon: Download, title: 'Downloads', desc: 'Open-source components, starter kits, and reference architectures.', count: '4 downloads', href: '/blog' },
  { icon: Code2, title: 'Documentation', desc: 'Technical docs for our frameworks, APIs, and integration patterns.', count: 'Full docs', href: '/blog' },
  { icon: HelpCircle, title: 'FAQs', desc: 'Answers to the most common questions about working with HYASCKA and our technology.', count: '10 questions', href: '/#faq' },
];

export const upcomingResources = [
  { icon: Video, title: 'Video Tutorials', desc: 'Hands-on walkthroughs of building AI agents and automation systems, coming soon.' },
  { icon: PlayCircle, title: 'Webinars', desc: 'Live sessions with our engineers on AI strategy, architecture, and real-world case studies.' },
];
