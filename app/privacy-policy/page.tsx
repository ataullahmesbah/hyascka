import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Privacy Policy — HYASCKA',
  description: 'How HYASCKA collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy', href: '/privacy-policy' }]}
        title="Privacy Policy"
        description="Last updated: August 2026"
      />
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 tab:px-8 lg:px-12">
          <div className="flex flex-col gap-8">
            <Block title="1. Information We Collect">
              We collect information you provide directly to us — such as your name, email, company,
              and project details when you submit our contact form or subscribe to our newsletter.
              We also collect anonymous analytics data about how visitors use our website.
            </Block>
            <Block title="2. How We Use Your Information">
              We use the information you provide to respond to your inquiries, send you relevant
              updates if you subscribe to our newsletter, and improve our website and services.
              We never sell your personal information to third parties.
            </Block>
            <Block title="3. Data Storage & Security">
              Your data is stored securely using industry-standard encryption and access controls.
              We limit access to personal data to authorized team members who need it to respond
              to your inquiry or provide our services.
            </Block>
            <Block title="4. Cookies">
              Our website may use cookies to remember your theme preference and collect anonymous
              analytics. You can disable cookies in your browser settings without affecting site
              functionality.
            </Block>
            <Block title="5. Your Rights">
              You have the right to request access to, correction of, or deletion of your personal
              data. To exercise any of these rights, contact us at privacy@hyaska.com.
            </Block>
            <Block title="6. Contact">
              If you have questions about this privacy policy or how we handle your data, please
              reach out to privacy@hyaska.com.
            </Block>
          </div>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <p className="text-base leading-relaxed text-muted-foreground text-pretty">{children}</p>
    </div>
  );
}
