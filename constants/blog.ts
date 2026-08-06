import type { BlogPost } from '@/types';

export const blogCategories = [
  'Artificial Intelligence',
  'AI Agents',
  'Automation',
  'Web Development',
  'Business',
  'Digital Transformation',
  'SEO',
  'Technology',
];

export const featuredPost: BlogPost = {
  category: 'AI Agents',
  title: 'From prototype to production: Building AI agents that actually work',
  excerpt:
    'Most AI agent demos fall apart in the real world. Here is our framework for building agents with evaluation suites, guardrails, and observability that hold up in production.',
  date: 'Aug 1, 2026',
  readTime: '8 min read',
  author: 'Sara Rahman',
  authorRole: 'Head of AI',
};

export const blogPosts: BlogPost[] = [
  { category: 'Automation', title: 'The hidden cost of manual workflows (and how to fix it)', date: 'Jul 28, 2026', readTime: '6 min', author: 'Mike Johnson' },
  { category: 'Technology', title: 'Why we choose Postgres for AI-native applications', date: 'Jul 22, 2026', readTime: '5 min', author: 'Mike Johnson' },
  { category: 'Business', title: 'How to identify high-impact AI opportunities in your business', date: 'Jul 15, 2026', readTime: '7 min', author: 'Adnan Khan' },
  { category: 'Web Development', title: 'Building sub-second web apps with modern architecture', date: 'Jul 10, 2026', readTime: '6 min', author: 'Lisa Brown' },
  { category: 'AI Agents', title: 'Guardrails, evals, and human-in-the-loop: A practical guide', date: 'Jul 3, 2026', readTime: '9 min', author: 'Sara Rahman' },
  { category: 'Digital Transformation', title: 'Scaling from MVP to enterprise: Architecture decisions that matter', date: 'Jun 28, 2026', readTime: '8 min', author: 'Adnan Khan' },
  { category: 'SEO', title: 'AI-powered SEO: How search is changing and what to do about it', date: 'Jun 22, 2026', readTime: '5 min', author: 'Lisa Brown' },
  { category: 'Artificial Intelligence', title: 'The state of AI in 2026: What actually works in production', date: 'Jun 15, 2026', readTime: '10 min', author: 'Sara Rahman' },
  { category: 'Automation', title: '5 workflows you should automate before the end of Q3', date: 'Jun 8, 2026', readTime: '4 min', author: 'Mike Johnson' },
];

export const relatedPosts: BlogPost[] = [
  { category: 'Technology', title: 'Why we choose Postgres for AI-native applications', date: 'Jul 22, 2026', readTime: '', author: '' },
  { category: 'AI Agents', title: 'Guardrails, evals, and human-in-the-loop: A practical guide', date: 'Jul 3, 2026', readTime: '', author: '' },
  { category: 'Artificial Intelligence', title: 'The state of AI in 2026: What actually works in production', date: 'Jun 15, 2026', readTime: '', author: '' },
];
