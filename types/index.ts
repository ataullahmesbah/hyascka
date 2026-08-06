import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
}

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  featured?: boolean;
}

export interface SolutionArea {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface AIAgent {
  icon: LucideIcon;
  name: string;
  status: string;
  tasks: string;
}

export interface WorkflowStep {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface Benefit {
  icon: LucideIcon;
  title: string;
  desc: string;
  metric: string;
  metricLabel: string;
}

export interface Pillar {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface TechCategory {
  title: string;
  items: string[];
}

export interface TechMarqueeItem {
  name: string;
  desc: string;
}

export interface Project {
  icon: LucideIcon;
  category: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  accent: string;
}

export interface CaseStudy {
  icon: LucideIcon;
  category: string;
  title: string;
  overview: string;
  challenge: string;
  solution: string;
  outcome: string;
  tech: string[];
  metrics: { value: string; label: string }[];
  accent: string;
}

export interface ProcessStep {
  icon: LucideIcon;
  step: string;
  title: string;
  desc: string;
  duration: string;
}

export interface Industry {
  icon: LucideIcon;
  name: string;
  desc: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  position: string;
  initials: string;
  accent: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
}

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  accent: string;
}

export interface ValueItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface Solution {
  icon: LucideIcon;
  title: string;
  problem: string;
  solution: string;
  benefits: string[];
  tech: string[];
}

export interface BlogPost {
  category: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  authorRole?: string;
  excerpt?: string;
}

export interface ResourceCategory {
  icon: LucideIcon;
  title: string;
  desc: string;
  count: string;
  href: string;
}

export interface SocialLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  responseTime: string;
}
