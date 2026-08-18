// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/dashboard/portfolio/page.tsx
// ==========================================================
import { redirect } from 'next/navigation';

// Portfolio is the Project model (see prisma/schema.prisma) — Projects
// already has full CRUD wired to real data. This page used to be a
// separate, unwired mock duplicate; redirecting avoids showing dashboard
// users fabricated stats instead of their actual projects.
export default function PortfolioPage() {
  redirect('/dashboard/projects');
}
