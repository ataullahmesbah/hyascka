import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Terms & Conditions — HYASCKA',
  description: 'The terms and conditions governing the use of the HYASCKA website and services.',
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Terms', href: '/terms' }]}
        title="Terms & Conditions"
        description="Last updated: August 2026"
      />
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 tab:px-8 lg:px-12">
          <div className="flex flex-col gap-8">
            <Block title="1. Acceptance of Terms">
              By accessing and using the HYASCKA website, you accept and agree to be bound by these
              Terms & Conditions. If you do not agree, please do not use our website.
            </Block>
            <Block title="2. Services">
              HYASCKA provides AI-first digital solutions including AI agents, automation systems,
              enterprise software, and web development. Specific engagement terms for any project
              will be defined in a separate agreement.
            </Block>
            <Block title="3. Intellectual Property">
              All content on this website — including text, graphics, logos, and design — is the
              property of HYASCKA unless otherwise stated. You may not reproduce or distribute our
              content without prior written consent.
            </Block>
            <Block title="4. Disclaimer">
              The information on this website is provided for general informational purposes. We
              make no warranties about the completeness or accuracy of the information. Any
              reliance you place on such information is strictly at your own risk.
            </Block>
            <Block title="5. Limitation of Liability">
              HYASCKA shall not be liable for any indirect, incidental, or consequential damages
              arising from your use of this website or our services.
            </Block>
            <Block title="6. Changes to Terms">
              We reserve the right to update these Terms & Conditions at any time. Continued use of
              our website after changes constitutes acceptance of the new terms.
            </Block>
            <Block title="7. Contact">
              For questions about these Terms & Conditions, please contact us at legal@hyaska.com.
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
