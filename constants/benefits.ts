import {
  MessageSquare, Brain, Database, Users, ShoppingCart, Bell,
  LayoutDashboard, CheckCircle2,
  Zap, DollarSign, Heart, Rocket, Eye, TrendingUp,
  Building2, ShieldCheck, Layers, Code2, Headset,
} from 'lucide-react';
import type { WorkflowStep, Benefit, Pillar } from '@/types';

export const workflowSteps: WorkflowStep[] = [
  { icon: MessageSquare, title: 'Customer Inquiry', desc: 'A customer submits a question or request' },
  { icon: Brain, title: 'AI Understands', desc: 'The agent parses intent and context' },
  { icon: Database, title: 'Database', desc: 'Relevant records are queried and enriched' },
  { icon: Users, title: 'CRM', desc: 'Customer profile is updated automatically' },
  { icon: ShoppingCart, title: 'Order', desc: 'Action is executed — order, ticket, or task' },
  { icon: Bell, title: 'Notification', desc: 'Stakeholders are alerted in real time' },
  { icon: LayoutDashboard, title: 'Dashboard', desc: 'Metrics and status appear on your dashboard' },
  { icon: CheckCircle2, title: 'Completed', desc: 'Workflow finishes — logged and verified' },
];

export const benefits: Benefit[] = [
  { icon: Zap, title: 'Increase Productivity', desc: 'Automate repetitive work so your team focuses on high-impact strategic initiatives.', metric: '2.8x', metricLabel: 'productivity boost' },
  { icon: DollarSign, title: 'Reduce Costs', desc: 'Intelligent systems cut operational overhead without sacrificing quality or speed.', metric: '41%', metricLabel: 'cost reduction' },
  { icon: Heart, title: 'Improve Customer Experience', desc: '24/7 AI-powered support and personalization your customers will immediately notice.', metric: '+38%', metricLabel: 'CSAT improvement' },
  { icon: Rocket, title: 'Scale Faster', desc: 'Architecture designed to grow from MVP to enterprise without rewrites or slowdowns.', metric: '3.4x', metricLabel: 'faster scaling' },
  { icon: Eye, title: 'Real-Time Insights', desc: 'Live analytics and forecasting put data-driven confidence behind every decision.', metric: '94%', metricLabel: 'forecast accuracy' },
  { icon: TrendingUp, title: 'Higher Revenue', desc: 'AI-driven personalization and automation unlock new revenue streams and growth.', metric: '+27%', metricLabel: 'revenue lift' },
];

export const pillars: Pillar[] = [
  { icon: Brain, title: 'AI First', desc: 'Every system is designed with AI at its core — not bolted on as an afterthought.' },
  { icon: Building2, title: 'Enterprise Ready', desc: 'Built for scale, security, and reliability from day one — no rewrites needed.' },
  { icon: ShieldCheck, title: 'Secure', desc: 'Security, guardrails, and observability baked into every layer of the stack.' },
  { icon: Layers, title: 'Scalable', desc: 'Architecture that grows seamlessly from MVP to thousands of users and beyond.' },
  { icon: Code2, title: 'Modern Stack', desc: 'Next.js, TypeScript, Postgres, and the best of modern AI engineering.' },
  { icon: Zap, title: 'Fast Delivery', desc: 'Weekly iterations with working software in your hands — not months of silence.' },
  { icon: Headset, title: 'Long-Term Support', desc: 'We stick around after launch — optimizing, refining, and expanding your system.' },
];
