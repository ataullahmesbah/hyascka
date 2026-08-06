import {
  Search, Map, PenTool, Code2, FlaskConical, Rocket, Headset,
} from 'lucide-react';
import type { ProcessStep } from '@/types';

export const processSteps: ProcessStep[] = [
  { icon: Search, step: '01', title: 'Discovery', desc: 'We map your business goals, audit existing systems, and identify the highest-leverage opportunities for AI.', duration: 'Week 1' },
  { icon: Map, step: '02', title: 'Strategy', desc: 'We define the product roadmap, data architecture, and AI model strategy — validated with stakeholders.', duration: 'Week 1–2' },
  { icon: PenTool, step: '03', title: 'Design', desc: 'We craft the product experience with interactive prototypes — before a line of production code is written.', duration: 'Week 2–3' },
  { icon: Code2, step: '04', title: 'Development', desc: 'Our engineers ship in tight iterations with weekly demos, integrating AI agents and automations directly.', duration: 'Week 3+' },
  { icon: FlaskConical, step: '05', title: 'Testing', desc: 'We run evaluation suites, guardrail checks, and load tests — ensuring the system is production-ready.', duration: 'Pre-launch' },
  { icon: Rocket, step: '06', title: 'Launch', desc: 'We deploy to production with observability, rollback safety, and team training for confident operation.', duration: 'Go-live' },
  { icon: Headset, step: '07', title: 'Support', desc: 'Post-launch we monitor, refine, and expand the system — turning your initial win into compounding value.', duration: 'Ongoing' },
];
