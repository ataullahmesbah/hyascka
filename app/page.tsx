import { Hero } from '@/components/sections/hero';
import { TrustMarquee } from '@/components/sections/trust-marquee';
import { Services } from '@/components/sections/services';
import { AISolutions } from '@/components/sections/ai-solutions';
import { AIAgents } from '@/components/sections/ai-agents';
import { AutomationWorkflow } from '@/components/sections/automation-workflow';
import { BusinessBenefits } from '@/components/sections/business-benefits';
import { WhyTrust } from '@/components/sections/why-trust';
import { Technologies } from '@/components/sections/technologies';
import { Work } from '@/components/sections/work';
import { Process } from '@/components/sections/process';
import { Industries } from '@/components/sections/industries';
import { Testimonials } from '@/components/sections/testimonials';
import { FAQ } from '@/components/sections/faq';
import { CTASection } from '@/components/cta-section';

export default function Home() {
  return (
    <>
      {/* 3. Hero */}
      <Hero />
      {/* 4. Trusted By + Statistics */}
      <TrustMarquee />
      {/* 5. Our Services */}
      <Services />
      {/* 6. AI Solutions */}
      <AISolutions />
      {/* 7. AI Agents Showcase */}
      <AIAgents />
      {/* 8. AI Automation Workflow */}
      <AutomationWorkflow />
      {/* 9. Business Benefits */}
      <BusinessBenefits />
      {/* 10. Why Choose HYASCKA */}
      <WhyTrust />
      {/* 11. Technology Stack */}
      <Technologies />
      {/* 12. Featured Projects */}
      <Work />
      {/* 13. Development Process */}
      <Process />
      {/* 14. Industries We Serve */}
      <Industries />
      {/* 15. Testimonials */}
      <Testimonials />
      {/* 16. Frequently Asked Questions */}
      <FAQ />
      {/* 17. Call To Action */}
      <CTASection />
    </>
  );
}
