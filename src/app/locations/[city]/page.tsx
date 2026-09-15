import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { layout } from "@/styles/theme";
import { pageMetadata } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, locationSchema } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { FlagIcon } from "@/components/ui/FlagIcon";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/sections/CtaSection";
import { ReviewsSection } from "@/sections/ReviewsSection";
import { locations, getLocation, locationPhone } from "@/data/locations";
import { landingPages } from "@/data/landingPages";
import { landingPath, locationPath, primaryCta } from "@/constants/navigation";
import { headlineSegments } from "@/lib/headline";

/**
 * City hubs — `/locations/chennai`, `/locations/dubai`.
 *
 * Two pages, not sixteen. The obvious play for local search is a page per city
 * per service, and every competitor on these results does it; it is also the
 * textbook definition of a doorway page and an active penalty. The reasoning is
 * recorded in full at the top of `data/locations.ts`.
 *
 * So each of these is written about the city — its market, its compliance
 * requirements, its working hours — and links out to the service and solution
 * pages rather than restating them with the place name swapped.
 */

export function generateStaticParams() {
  return locations.map((location) => ({ city: location.id }));
}

export async function generateMetadata(
  props: PageProps<"/locations/[city]">,
): Promise<Metadata> {
  const { city } = await props.params;
  const location = getLocation(city);

  if (!location) return {};

  return pageMetadata({
    title: location.metaTitle,
    description: location.metaDescription,
    path: locationPath(location.id),
  });
}

export default async function LocationPage(
  props: PageProps<"/locations/[city]">,
) {
  const { city } = await props.params;
  const location = getLocation(city);

  if (!location) notFound();

  const phone = locationPhone(location);

  return (
    <>
      <JsonLd data={locationSchema(location)} />
      <JsonLd data={faqSchema(location.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: location.city, path: locationPath(location.id) },
        ])}
      />

      <main id="main">
        <PageHeader
          eyebrow={`${location.city}, ${location.country}`}
          title={headlineSegments(location.h1, location.h1Accent)}
          description={location.intro}
          action={
            <>
              <Button href={primaryCta.href} icon="arrowRight">
                {primaryCta.label}
              </Button>
              {phone ? (
                <Button href={`tel:+${phone.e164}`} variant="secondary">
                  {phone.display}
                </Button>
              ) : null}
            </>
          }
        />

        {/* Why here, specifically. If these four points would read identically
            with the city name swapped, the page has no reason to exist — so
            they are about this market rather than about us. */}
        <section className={layout.sectionY}>
          <Container>
            <SectionHeading
              eyebrow={`Working in ${location.city}`}
              title="What this means in practice"
            />

            <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {location.highlights.map((highlight) => (
                <RevealItem key={highlight.title} variant="scaleIn">
                  <Card variant="glass" className="h-full">
                    <h2 className={cn(grotesk.h4, "text-pretty")}>
                      {highlight.title}
                    </h2>
                    <p className={cn(text.body, "mt-3 text-pretty")}>
                      {highlight.body}
                    </p>
                  </Card>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>

        {/* The hub's actual job: passing standing down to every landing page. */}
        <section className={layout.sectionY}>
          <Container>
            <SectionHeading
              eyebrow="What we build"
              title={`Software we build for ${location.city} businesses`}
              description="Each of these is a full description of the work, not a summary — follow whichever one matches what you are trying to fix."
            />

            <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {landingPages.map((page) => (
                <RevealItem key={page.id}>
                  <Link
                    href={landingPath(page.section, page.id)}
                    className="block h-full"
                  >
                    <Card interactive className="h-full">
                      <Icon
                        name={page.icon}
                        size={20}
                        className="text-brand-soft"
                      />
                      <h3 className={cn(grotesk.h4, "mt-4 text-pretty")}>
                        {page.title}
                      </h3>
                      <p className={cn(text.small, "mt-2.5 text-pretty")}>
                        {page.summary}
                      </p>
                    </Card>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>

        <ReviewsSection />

        {/* Areas served. Rendered as plain text rather than as links: these are
            places we work, not pages we have, and linking each one to a page
            that does not exist is how the doorway problem starts. */}
        <section className={layout.sectionY}>
          <Container>
            <Reveal>
              <Card variant="glass">
                <div className="flex items-center gap-3">
                  <FlagIcon code={location.countryCode} size={22} />
                  <h2 className={cn(grotesk.h4)}>
                    Areas we serve from {location.city}
                  </h2>
                </div>
                <p className={cn(text.body, "mt-4 text-pretty")}>
                  {location.areasServed.join(" · ")}
                </p>
              </Card>
            </Reveal>
          </Container>
        </section>

        <section className={layout.sectionY}>
          <Container>
            <SectionHeading
              eyebrow="Questions"
              title={`Working with us in ${location.city}`}
            />

            <Reveal>
              <Accordion
                items={location.faqs}
                defaultOpenFirst
                className="max-w-3xl"
              />
            </Reveal>
          </Container>
        </section>

        <CtaSection />
      </main>
    </>
  );
}
