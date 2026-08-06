import {
  Bot, Workflow, Users, Boxes, Building2, LayoutDashboard,
  FileBarChart, LineChart, Headphones, Brain, Wallet,
} from 'lucide-react';
import type { Solution, SolutionArea, AIAgent } from '@/types';

export const solutionAreas: SolutionArea[] = [
  { icon: Headphones, title: 'Customer Service', desc: 'AI agents resolve tickets 24/7, escalating only when human judgment is needed.' },
  { icon: Workflow, title: 'Operations', desc: 'Automate scheduling, inventory, and logistics with real-time AI decision-making.' },
  { icon: LineChart, title: 'Sales', desc: 'AI-powered lead scoring, outreach, and pipeline acceleration that converts more.' },
  { icon: FileBarChart, title: 'Reporting', desc: 'Auto-generate insights and summaries from your data — no more manual reporting.' },
  { icon: Brain, title: 'Automation', desc: 'Connect your tools and let AI handle the repetitive steps between them.' },
];

export const aiAgents: AIAgent[] = [
  { icon: Headphones, name: 'Customer Agent', status: 'Running', tasks: '1.2k' },
  { icon: LineChart, name: 'Sales Agent', status: 'Running', tasks: '847' },
  { icon: Headphones, name: 'Support Agent', status: 'Running', tasks: '2.1k' },
  { icon: Brain, name: 'Marketing Agent', status: '24/7', tasks: '430' },
  { icon: Wallet, name: 'Finance Agent', status: 'Running', tasks: '156' },
  { icon: FileBarChart, name: 'Analytics Agent', status: '24/7', tasks: '3.8k' },
];

export const solutions: Solution[] = [
  {
    icon: Bot,
    title: 'AI Agents',
    problem: 'Your team spends hours on repetitive tasks like triaging tickets, answering the same questions, and updating records.',
    solution: 'Autonomous AI agents that perceive, reason, act, and verify — resolving issues end-to-end with human escalation when needed.',
    benefits: ['72% auto-resolution rate', '24/7 availability', 'Consistent, auditable decisions'],
    tech: ['OpenAI', 'LangChain', 'Pinecone', 'Node.js'],
  },
  {
    icon: Workflow,
    title: 'Business Automation',
    problem: 'Manual workflows create bottlenecks, errors, and delays across your operations.',
    solution: 'Intelligent pipelines that connect your tools, process documents, and trigger actions automatically — with AI handling the decision points.',
    benefits: ['12+ hours saved per week', '87% of tasks automated', 'Sub-2s processing time'],
    tech: ['Python', 'n8n', 'Redis', 'PostgreSQL'],
  },
  {
    icon: Users,
    title: 'CRM Systems',
    problem: 'Off-the-shelf CRMs don\'t match your sales process and force your team to work around their limitations.',
    solution: 'Custom CRM platforms with AI lead scoring, automated follow-ups, and predictive pipeline analytics built around your workflow.',
    benefits: ['2.3x pipeline growth', 'Automated lead scoring', 'Custom sales workflows'],
    tech: ['Next.js', 'Supabase', 'Prisma', 'PostgreSQL'],
  },
  {
    icon: Boxes,
    title: 'ERP Systems',
    problem: 'Disparate systems for inventory, finance, and operations create silos and blind spots.',
    solution: 'Unified ERP platforms integrating every business function with AI-driven forecasting and anomaly detection.',
    benefits: ['41% cost reduction', 'Real-time visibility', 'Unified data model'],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    icon: Building2,
    title: 'Enterprise Applications',
    problem: 'Your internal tools are slowing down your team instead of accelerating them.',
    solution: 'Scalable, purpose-built enterprise applications with role-based access, audit trails, and architecture designed for thousands of users.',
    benefits: ['Built for scale', 'Role-based security', 'Audit-ready logging'],
    tech: ['Next.js', 'TypeScript', 'AWS', 'PostgreSQL'],
  },
  {
    icon: LayoutDashboard,
    title: 'Internal Dashboards',
    problem: 'Your team can\'t see what matters — data is scattered across too many tools.',
    solution: 'Real-time, customizable dashboards that surface the metrics that matter — with AI summaries and anomaly alerts.',
    benefits: ['Real-time metrics', 'AI-powered summaries', 'Customizable views'],
    tech: ['React', 'D3.js', 'Supabase', 'Redis'],
  },
  {
    icon: FileBarChart,
    title: 'Reporting Systems',
    problem: 'Manual reporting consumes hours every week and is always out of date.',
    solution: 'Automated reporting systems that pull data from every source, generate insights, and deliver reports on schedule.',
    benefits: ['Auto-generated reports', 'Always up-to-date', 'Scheduled delivery'],
    tech: ['Python', 'PostgreSQL', 'Next.js', 'Cloudflare'],
  },
  {
    icon: LineChart,
    title: 'Analytics',
    problem: 'You have data but no way to turn it into actionable insight.',
    solution: 'AI-powered analytics platforms that surface trends, predict outcomes, and recommend actions — not just charts.',
    benefits: ['94% forecast accuracy', 'Predictive insights', 'Action recommendations'],
    tech: ['Python', 'PyTorch', 'PostgreSQL', 'Vercel'],
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    problem: 'Support tickets pile up, response times grow, and customers lose patience.',
    solution: 'AI-powered support systems that resolve common issues instantly, escalate intelligently, and learn from every interaction.',
    benefits: ['+38% CSAT improvement', 'Instant resolution', 'Smart escalation'],
    tech: ['OpenAI', 'Next.js', 'Supabase', 'Redis'],
  },
  {
    icon: Brain,
    title: 'Business Intelligence',
    problem: 'Leadership lacks a clear, real-time picture of business performance.',
    solution: 'BI platforms that unify your data, apply AI for pattern detection, and deliver executive-ready insights on demand.',
    benefits: ['Unified data layer', 'AI pattern detection', 'Executive-ready insights'],
    tech: ['Python', 'PostgreSQL', 'React', 'AWS'],
  },
];
