// FILE: app/refund-policy/page.tsx
// PURPOSE: Refund / Cancellation Policy — PRD section 30 required page
// (explicitly named given HYASCKA plans to use payment functionality),
// did not exist before. Standard agency-services boilerplate — written
// around HYASCKA's actual model (custom-quoted engagements, not
// self-serve fixed subscriptions), without inventing specific figures
// like exact refund percentages/timelines that would need real business
// sign-off. Flagged for legal review, same as the other legal pages.
import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy — HYASCKA',
  description: 'How refunds, cancellations, and project changes are handled for HYASCKA engagements.',
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Refund & Cancellation Policy', href: '/refund-policy' }]}
        title="Refund & Cancellation Policy"
        description="Last updated: August 2026"
      />
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 tab:px-8 lg:px-12">
          <div className="flex flex-col gap-8">
            <Block title="1. Custom-Quoted Engagements">
              Most HYASCKA services are scoped and priced individually via a custom quote or offer
              rather than sold as a fixed, self-serve package. The specific payment schedule,
              milestones, and cancellation terms for a given engagement are set out in that
              project&apos;s offer or agreement, which takes precedence over the general terms below
              where the two differ.
            </Block>
            <Block title="2. Deposits & Upfront Payments">
              Where a project requires an upfront deposit or initial payment before work begins, that
              payment reserves our capacity and covers initial planning/setup work. Deposits are
              generally non-refundable once work on the engagement has started, except where required
              by applicable law.
            </Block>
            <Block title="3. Milestone-Based Work">
              For projects billed in stages or milestones, you are only charged for stages that have
              been delivered or are in progress. If an engagement is cancelled partway through, work
              already completed or in progress is payable; any portion paid in advance for work not
              yet started is eligible for a refund, less any non-refundable deposit already disclosed
              at the start of the engagement.
            </Block>
            <Block title="4. Cancellations">
              Either party may request to cancel an ongoing engagement by written notice (email is
              sufficient). We will confirm what has been delivered, what is in progress, and what
              portion of any advance payment (if any) is refundable per the terms above.
            </Block>
            <Block title="5. Fixed-Price Services">
              For any service explicitly sold at a fixed, published price rather than a custom quote,
              refund eligibility will be stated at the point of purchase. Where not otherwise stated,
              the general terms in this policy apply.
            </Block>
            <Block title="6. How to Request a Refund">
              To request a refund or discuss a cancellation, contact us at billing@hyaska.com with
              your order or offer reference. We aim to respond within a reasonable business timeframe
              and resolve refund requests promptly once eligibility is confirmed.
            </Block>
            <Block title="7. Changes to This Policy">
              We may update this policy as our services and payment options evolve. Material changes
              will be reflected in the &ldquo;Last updated&rdquo; date above; the policy in effect at
              the time you accepted an offer governs that engagement.
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
