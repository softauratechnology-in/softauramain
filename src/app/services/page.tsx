import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { layout } from "@/styles/theme";
import { pageMetadata } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServicesSection } from "@/sections/ServicesSection";
import { ProcessSection } from "@/sections/ProcessSection";
import { TechnologySection } from "@/sections/TechnologySection";
import { CtaSection } from "@/sections/CtaSection";
import { Button } from "@/components/ui/Button";
import { servicePages } from "@/data/landingPages";
import { servicePath, primaryCta, routes, SECTION_IDS } from "@/constants/navigation";

/**
 * Services page.
 *
 * Answers three questions in order, which is the order a buyer asks them:
 * what do you build, how do you work, and will it hold up.
 *
 * It is now also a **hub**. The grid at the top links to the four service
 * landing pages, each of which answers one search completely. That link block
 * is the substantive change: the footer used to point four links at
 * `/services#saas-development` and similar, which as far as a search engine is
 * concerned were four links to this one page. Distinct URLs are what let each
 * service accumulate standing of its own.
 *
 * The in-page anchors below are kept, so no existing link breaks.
 */

export const metadata: Metadata = pageMetadata({
  title: "Software Development Services",
  description:
    "Custom software development services: websites, web applications, mobile apps and e-commerce — built by senior engineers in Chennai and Dubai.",
  path: routes.services,
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: "Services", path: routes.services }])}
      />

      <main id="main">
        <PageHeader
          eyebrow="Services"
          title={[
            { text: "Custom software" },
            { text: "development services", accent: true },
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

        <section className={layout.sectionY}>
          <Container>
            <SectionHeading
              eyebrow="Explore"
              title="What we build"
              description="Each of these has a page of its own — what is included, who it suits, what it costs and how long it takes."
            />

            <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {servicePages.map((page) => (
                <RevealItem key={page.id} variant="scaleIn">
                  <Link href={servicePath(page.id)} className="block h-full">
                    <Card interactive className="h-full">
                      <Icon
                        name={page.icon}
                        size={24}
                        className="text-brand-soft"
                      />
                      {/* h3: inside the section headed by the h2 above. */}
                      <h3 className={cn(grotesk.h4, "mt-5 text-pretty")}>
                        {page.title}
                      </h3>
                      <p className={cn(text.body, "mt-3 text-pretty")}>
                        {page.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-soft">
                        Read more
                        <Icon name="arrowRight" size={15} />
                      </span>
                    </Card>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>

        <ServicesSection />
        <ProcessSection />
        <TechnologySection />
        <CtaSection />
      </main>
    </>
  );
}
