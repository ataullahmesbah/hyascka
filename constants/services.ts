import {
  Bot, Workflow, Globe, Building2, ShoppingBag, Search, Palette, Megaphone,
  Code2, Plug,
} from 'lucide-react';
import type { Service } from '@/types';

export const services: Service[] = [
  {
    icon: Bot,
    title: 'AI Agents',
    description: 'Autonomous agents that handle support triage, research, data entry, and complex multi-step workflows — with guardrails and human oversight.',
    accent: 'from-primary to-accent',
    featured: true,
  },
  {
    icon: Workflow,
    title: 'AI Automation',
    description: 'Replace repetitive manual work with intelligent pipelines that connect your tools, process documents, and trigger actions in real time.',
    accent: 'from-accent to-chart-3',
  },
  {
    icon: Globe,
    title: 'Website Development',
    description: 'High-performance, bespoke websites engineered for speed, accessibility, and a premium user experience across every device.',
    accent: 'from-chart-3 to-chart-4',
  },
  {
    icon: Building2,
    title: 'Enterprise Software',
    description: 'Scalable internal platforms, dashboards, and operational systems built on robust, maintainable architecture your team can own.',
    accent: 'from-chart-4 to-primary',
  },
  {
    icon: ShoppingBag,
    title: 'Ecommerce Development',
    description: 'Conversion-optimized storefronts and headless commerce systems with AI-driven personalization, search, and merchandising.',
    accent: 'from-primary to-chart-5',
  },
  {
    icon: Search,
    title: 'SEO',
    description: 'AI-powered search optimization that puts your brand in front of the right audience with data-driven content and technical SEO.',
    accent: 'from-chart-5 to-accent',
  },
  {
    icon: Palette,
    title: 'Branding',
    description: 'Distinctive brand identities and design systems that communicate trust, innovation, and premium quality at every touchpoint.',
    accent: 'from-accent to-chart-4',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'AI-assisted campaigns, content strategies, and growth experiments that maximize reach and ROI across every channel.',
    accent: 'from-chart-3 to-primary',
  },
];

export const allServicesList: { icon: typeof Bot; title: string; desc: string }[] = [
  { icon: Bot, title: 'AI Agents', desc: 'Autonomous agents that handle support, research, data entry, and multi-step workflows with guardrails and human oversight.' },
  { icon: Workflow, title: 'AI Automation', desc: 'Replace repetitive manual work with intelligent pipelines that connect your tools and trigger actions in real time.' },
  { icon: Code2, title: 'Custom Software', desc: 'Tailored applications built from scratch to solve your specific business problems — no off-the-shelf compromises.' },
  { icon: Globe, title: 'Website Development', desc: 'High-performance, bespoke websites engineered for speed, accessibility, and a premium user experience.' },
  { icon: ShoppingBag, title: 'Ecommerce Development', desc: 'Conversion-optimized storefronts and headless commerce systems with AI-driven personalization and search.' },
  { icon: Search, title: 'SEO', desc: 'AI-powered search optimization that puts your brand in front of the right audience with data-driven content strategy.' },
  { icon: Palette, title: 'Branding', desc: 'Distinctive brand identities and design systems that communicate trust, innovation, and premium quality.' },
  { icon: Megaphone, title: 'Digital Marketing', desc: 'AI-assisted campaigns, content strategies, and growth experiments that maximize reach and ROI.' },
  { icon: Building2, title: 'Enterprise Solutions', desc: 'Scalable internal platforms, dashboards, and operational systems built on robust, maintainable architecture.' },
  { icon: Plug, title: 'API Integration', desc: 'Connect your tools and systems with clean, documented APIs and intelligent middleware that just works.' },
];
