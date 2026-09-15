import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { layout } from "@/styles/theme";
import { pageMetadata } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/sections/CtaSection";
import { solutionPages } from "@/data/landingPages";
import { locations } from "@/data/locations";
import {
  solutionPath,
  locationPath,
  primaryCta,
  routes,
} from "@/constants/navigation";

/**
 * `/solutions` — the hub above the software-category landing pages.
 *
 * A hub rather than a list. Its job is to pass standing down to the four pages
 * beneath it and to catch the broader searches ("custom business software")
 * that do not name a category, so each detail page is free to answer exactly
 * one search rather than hedging across several.
 */

export const metadata: Metadata = pageMetadata({
  title: "Custom Software Solutions",
  description:
    "Custom ERP, school management, inventory and HR software for businesses in Chennai and Dubai. Built around your process — and you own the code.",
  path: routes.solutions,
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Solutions", path: routes.solutions },
        ])}
      />

      <main id="main">
        <PageHeader
          eyebrow="Solutions"
          title={[
            { text: "Software built around" },
            { text: "how you work", accent: true },
          ]}
          description="These are the systems we are asked for most often. Each one is built for your organisation rather than licensed per user, and each is a system you end up owning outright. If what you need is not listed, it is still worth asking — most of our work starts as a description of a problem rather than a product name."
          action={
            <>
              <Button href={primaryCta.href} icon="arrowRight">
                {primaryCta.label}
              </Button>
              <Button href={routes.services} variant="secondary">
                Browse services
              </Button>
            </>
          }
        />

        <section className={layout.sectionY}>
          <Container>
            <SectionHeading
              eyebrow="What we build"
              title="Systems we are asked for most"
              description="Every one of these replaces a combination of spreadsheets, paper and messaging groups that stopped coping some time ago."
            />

            <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {solutionPages.map((page) => (
                <RevealItem key={page.id} variant="scaleIn">
                  <Link
                    href={solutionPath(page.id)}
                    className="block h-full"
                    aria-label={`${page.title} — ${page.summary}`}
                  >
                    <Card interactive className="h-full">
                      <Icon
                        name={page.icon}
                        size={24}
                        className="text-brand-soft"
                      />
                      <h2 className={cn(grotesk.h4, "mt-5 text-pretty")}>
                        {page.title}
                      </h2>
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

        <section className={layout.sectionY}>
          <Container>
            <SectionHeading
              eyebrow="Where we work"
              title="Chennai and Dubai"
              description="We work remotely as standard, in your working day rather than ours."
            />

            <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {locations.map((location) => (
                <RevealItem key={location.id}>
                  <Link href={locationPath(location.id)} className="block h-full">
                    <Card interactive variant="glass" className="h-full">
                      <h2 className={cn(grotesk.h4, "text-pretty")}>
                        Software development in {location.city}
                      </h2>
                      <p className={cn(text.body, "mt-3 text-pretty")}>
                        {location.intro}
                      </p>
                    </Card>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>

        <CtaSection />
      </main>
    </>
  );
}
