import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Contact } from '@/components/sections/contact';
import { FAQ } from '@/components/sections/faq';

export const metadata: Metadata = {
  title: 'Contact — HYASCKA',
  description:
    'Get in touch with HYASCKA. Tell us about your business and the problem you want to solve — we respond within one business day.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]}
        title={
          <>
            Let&apos;s build something{' '}
            <span className="text-gradient-primary">intelligent</span> together
          </>
        }
        description="Tell us about your business and the problem you want to solve. We'll get back within one business day with a clear path forward."
      />
      <Contact />
      <FAQ />
    </>
  );
}
