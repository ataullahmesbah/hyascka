import {
  Compass, Zap, Users, ShieldCheck,
  Award, Handshake, TrendingUp, Lightbulb, Cpu,
  Target, Eye, Heart,
} from 'lucide-react';
import type { ValueItem, TimelineEvent, TeamMember } from '@/types';

export const approach: ValueItem[] = [
  { icon: Compass, title: 'Discovery First', desc: 'We start by understanding your business, not by pitching technology.' },
  { icon: Zap, title: 'Iterative Delivery', desc: 'Weekly demos with working software — you see progress every step of the way.' },
  { icon: Users, title: 'Senior-Only Teams', desc: 'Every engineer on your project has years of production experience.' },
  { icon: ShieldCheck, title: 'Built to Own', desc: 'Clean handoffs, thorough documentation, and architecture your team can extend.' },
];

export const coreValues: ValueItem[] = [
  { icon: ShieldCheck, title: 'Honesty Over Hype', desc: 'We tell you what works and what doesn\'t — even when it\'s not what you expected to hear.' },
  { icon: Award, title: 'Production Quality', desc: 'Every system we ship is built to run in production — not just to demo well.' },
  { icon: Handshake, title: 'Partnership', desc: 'We embed with your team and build systems you own and understand completely.' },
  { icon: TrendingUp, title: 'Outcomes Over Output', desc: 'We measure success by your business results, not by lines of code written.' },
  { icon: Lightbulb, title: 'Curiosity', desc: 'We stay on the frontier of AI so you don\'t have to — and we share what we learn.' },
  { icon: Cpu, title: 'Engineering Excellence', desc: 'Clean architecture, thorough testing, and documentation are non-negotiable.' },
];

export const timeline: TimelineEvent[] = [
  { year: '2023', title: 'HYASCKA Founded', desc: 'Started with a mission to make production-grade AI accessible to growing businesses.' },
  { year: '2024', title: 'First AI Agents Shipped', desc: 'Deployed autonomous agents in production for our first enterprise clients.' },
  { year: '2025', title: '100+ Systems Delivered', desc: 'Crossed 120 systems shipped across 25+ countries and 8 industries.' },
  { year: '2026', title: 'Expanding Globally', desc: 'Growing our team and platform to serve thousands of businesses worldwide.' },
];

export const team: TeamMember[] = [
  { initials: 'AK', name: 'Adnan Khan', role: 'Founder & CEO', accent: 'from-primary to-accent' },
  { initials: 'SR', name: 'Sara Rahman', role: 'Head of AI', accent: 'from-accent to-chart-3' },
  { initials: 'MJ', name: 'Mike Johnson', role: 'Lead Engineer', accent: 'from-chart-3 to-chart-4' },
  { initials: 'LB', name: 'Lisa Brown', role: 'Product Design', accent: 'from-chart-4 to-primary' },
];
