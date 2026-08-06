import type { TechMarqueeItem, TechCategory } from '@/types';

export const techMarqueeItems: TechMarqueeItem[] = [
  { name: 'Next.js', desc: 'React framework for production' },
  { name: 'React', desc: 'UI library for building interfaces' },
  { name: 'TypeScript', desc: 'Type-safe JavaScript at scale' },
  { name: 'Node.js', desc: 'Server-side JavaScript runtime' },
  { name: 'Prisma', desc: 'Type-safe database ORM' },
  { name: 'PostgreSQL', desc: 'Relational database' },
  { name: 'MongoDB', desc: 'Document database' },
  { name: 'Docker', desc: 'Containerization platform' },
  { name: 'OpenAI', desc: 'AI models and APIs' },
  { name: 'AWS', desc: 'Cloud infrastructure' },
  { name: 'Cloudflare', desc: 'Edge network and security' },
  { name: 'Vercel', desc: 'Deployment platform' },
];

export const techCategories: TechCategory[] = [
  { title: 'AI & Machine Learning', items: ['OpenAI', 'Anthropic', 'LangChain', 'LlamaIndex', 'Pinecone', 'PyTorch'] },
  { title: 'Backend & Data', items: ['PostgreSQL', 'Supabase', 'Prisma', 'Redis', 'Node.js', 'Python'] },
  { title: 'Frontend & Web', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'] },
  { title: 'Cloud & DevOps', items: ['AWS', 'Vercel', 'Cloudflare', 'Docker', 'GitHub Actions', 'Terraform'] },
];
