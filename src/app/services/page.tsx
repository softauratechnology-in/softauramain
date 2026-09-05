import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesSection } from "@/sections/ServicesSection";
import { ProcessSection } from "@/sections/ProcessSection";
import { TechnologySection } from "@/sections/TechnologySection";
import { CtaSection } from "@/sections/CtaSection";
import { Button } from "@/components/ui/Button";
import { primaryCta, routes, SECTION_IDS } from "@/constants/navigation";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software development: SaaS products, ERP systems for schools and growing businesses, mobile apps and online stores. Built by senior engineers in India and the UAE.",
  alternates: { canonical: routes.services },
};

/**
 * Services page.
 *
 * Answers three questions in order, which is the order a buyer asks them:
 * what do you build, how do you work, and will it hold up.
 */
export default function ServicesPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Services"
        title={[
          { text: "What we" },
          { text: "build for you", accent: true },
        ]}
        description="We build software for organisations that have outgrown the way they are working now — and for founders with a product to sell. If you are not sure which of these you need, that is a normal place to start from."
        action={
          <>
            <Button href={primaryCta.href} icon="arrowRight">
              {primaryCta.label}
            </Button>
            <Button
              href={`${routes.services}#${SECTION_IDS.process}`}
              variant="secondary"
            >
              How we work
            </Button>
          </>
        }
      />

      <ServicesSection />
      <ProcessSection />
      <TechnologySection />
      <CtaSection />
    </main>
  );
}
