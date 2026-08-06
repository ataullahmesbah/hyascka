import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Roles ──
  const roles = await Promise.all(
    Object.values(RoleName).map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const superAdminRole = roles.find((r) => r.name === 'SUPER_ADMIN')!;
  const adminRole = roles.find((r) => r.name === 'ADMIN')!;
  const userRole = roles.find((r) => r.name === 'USER')!;

  // ── Admin User ──
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@hyaska.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@12345';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail.toLowerCase() },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: 'HYASCKA Admin',
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        emailVerified: new Date(),
        roleId: superAdminRole.id,
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // ── Categories ──
  const categoryNames = [
    'Artificial Intelligence',
    'AI Agents',
    'Automation',
    'Web Development',
    'Business',
    'Digital Transformation',
    'SEO',
    'Technology',
  ];

  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
        update: {},
        create: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        },
      })
    )
  );

  // ── Services ──
  const services = [
    { title: 'AI Agents', description: 'Autonomous agents for support, research, and workflows.', icon: 'Bot', order: 1, featured: true },
    { title: 'AI Automation', description: 'Intelligent pipelines that connect your tools.', icon: 'Workflow', order: 2, featured: true },
    { title: 'Website Development', description: 'High-performance, bespoke websites.', icon: 'Globe', order: 3 },
    { title: 'Enterprise Software', description: 'Scalable internal platforms and dashboards.', icon: 'Building2', order: 4 },
    { title: 'Ecommerce Development', description: 'Conversion-optimized storefronts with AI.', icon: 'ShoppingBag', order: 5 },
    { title: 'SEO', description: 'AI-powered search optimization.', icon: 'Search', order: 6 },
    { title: 'Branding', description: 'Distinctive brand identities and design systems.', icon: 'Palette', order: 7 },
    { title: 'Digital Marketing', description: 'AI-assisted campaigns and growth experiments.', icon: 'Megaphone', order: 8 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.title.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        title: s.title,
        slug: s.title.toLowerCase().replace(/\s+/g, '-'),
        description: s.description,
        icon: s.icon,
        order: s.order,
        featured: s.featured,
      },
    });
  }

  // ── Technologies ──
  const techs = [
    { name: 'Next.js', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Prisma', category: 'Database' },
    { name: 'OpenAI', category: 'AI' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Tailwind CSS', category: 'Frontend' },
  ];

  for (const t of techs) {
    await prisma.technology.upsert({
      where: { slug: t.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        name: t.name,
        slug: t.name.toLowerCase().replace(/\s+/g, '-'),
        category: t.category,
      },
    });
  }

  // ── FAQs ──
  const faqs = [
    { question: 'What services does HYASCKA offer?', answer: 'We build AI agents, intelligent automation, enterprise software, custom web applications, ecommerce platforms, and digital marketing solutions — all with an AI-first approach.' },
    { question: 'How quickly can we get started?', answer: 'Most engagements kick off within one to two weeks of our first call. We start with a focused discovery sprint to validate scope and architecture.' },
    { question: 'Do you build production AI or just prototypes?', answer: 'Both, but everything we ship is production-grade with evaluation suites, guardrails, observability, and human-in-the-loop controls.' },
    { question: 'What does a typical engagement look like?', answer: 'We run weekly iterations with live demos, shared roadmaps, and direct access to the engineering team.' },
    { question: 'Can you work with our existing team and stack?', answer: 'Yes. We integrate with in-house teams regularly and adapt to your existing architecture, CI/CD, and conventions.' },
    { question: 'What happens after launch?', answer: 'We offer ongoing support and optimization — monitoring model performance, refining agents, and expanding the system.' },
  ];

  for (let i = 0; i < faqs.length; i++) {
    await prisma.fAQ.create({
      data: { ...faqs[i], order: i + 1 },
    });
  }

  // ── Testimonials ──
  const testimonials = [
    { quote: 'HYASCKA built our AI support agent in six weeks. It now resolves over 70% of incoming tickets on its own.', name: 'Sarah Chen', position: 'VP Product, Nexora', initials: 'SC', rating: 5 },
    { quote: "They didn't just ship software — they re-architected how we think about automation.", name: 'Marcus Reid', position: 'COO, Vertex Logistics', initials: 'MR', rating: 5 },
    { quote: "The most senior team I've worked with. We went from idea to production AI dashboard in under two months.", name: 'Aisha Bello', position: 'CTO, Quantia Health', initials: 'AB', rating: 5 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // ── Site Settings ──
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteName: 'HYASCKA',
        siteUrl: process.env.APP_URL ?? 'http://localhost:3000',
        email: 'hello@hyaska.com',
        phone: '+1 (555) 010-2026',
        description: 'AI-first digital solutions company building intelligent software for ambitious businesses.',
        socialLinks: {
          linkedin: '#',
          github: '#',
        },
      },
    });
  }

  console.log('Seed completed successfully.');
  console.log(`Roles: ${roles.length} | Categories: ${categories.length}`);
  console.log(`Admin email: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
