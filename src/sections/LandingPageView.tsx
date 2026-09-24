import Link from "next/link";
import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { layout } from "@/styles/theme";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReviewsSection } from "@/sections/ReviewsSection";
import { getProject } from "@/data/projects";
import { findLandingPage, type LandingPage } from "@/data/landingPages";
import {
  landingPath,
  caseStudyPath,
  primaryCta,
  routes,
} from "@/constants/navigation";
import { headlineSegments } from "@/lib/headline";

/**
 * The body of every `/services/[slug]` and `/solutions/[slug]` page.
 *
 * One component for both segments because the two differ in what they are
 * *about*, not in how they are read. A buyer landing from a search wants the
 * same five things in the same order — what this is, what I get, whether it
 * applies to me, proof, and the answers to the questions I would otherwise have
 * to ask — and giving `/solutions` a different arrangement for its own sake
 * would cost consistency and buy nothing.
 *
 * That order is also roughly descending order of how likely a reader is to
 * leave. The intro answers the search outright in the page header; nothing
 * below it is required reading.
 */

export interface LandingPageViewProps {
  page: LandingPage;
}

export function LandingPageView({ page }: LandingPageViewProps) {
  const project = page.relatedProjectId
    ? getProject(page.relatedProjectId)
    : undefined;

  const siblings = page.related
    .map((slug) => findLandingPage(slug))
    .filter((sibling): sibling is LandingPage => sibling !== undefined);

  return (
    <main id="main">
      <PageHeader
        eyebrow={page.section === "services" ? "Services" : "Solutions"}
        title={headlineSegments(page.h1, page.h1Accent)}
        description={page.intro}
        action={
          <>
            <Button href={primaryCta.href} icon="arrowRight">
              {primaryCta.label}
            </Button>
            <Button href={routes.work} variant="secondary">
              See our work
            </Button>
          </>
        }
      />

      {/* What you get */}
      <section className={layout.sectionY}>
        <Container>
          <SectionHeading
            eyebrow="What you get"
            title="What is included"
            description={page.summary}
          />

          <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {page.deliverables.map((deliverable) => (
              <RevealItem key={deliverable}>
                <Card className="flex h-full items-start gap-3.5">
                  <Icon
                    name="check"
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-soft"
                  />
                  <span className={cn(text.body, "text-pretty")}>
                    {deliverable}
                  </span>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Who it is for. Written as situations rather than industries: a reader
          recognises their own problem far faster than they place themselves in
          a sector, and a line like "the spreadsheet has stopped coping" is
          close to what people actually type into a search box. */}
      <section className={layout.sectionY}>
        <Container>
          <SectionHeading
            eyebrow="Who this is for"
            title="You are probably here because"
          />

          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {page.useCases.map((useCase) => (
              <RevealItem key={useCase.title} variant="scaleIn">
                <Card variant="glass" className="h-full">
                  <h3 className={cn(grotesk.h4, "text-pretty")}>
                    {useCase.title}
                  </h3>
                  <p className={cn(text.body, "mt-3 text-pretty")}>
                    {useCase.body}
                  </p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Proof, where we have it. Only rendered when this page's subject maps to
          work that actually shipped — a "related case study" block pointing at
          something merely adjacent is worse than no block at all. */}
      {project ? (
        <section className={layout.sectionY}>
          <Container>
            <Reveal>
              <Card variant="gradient" className="sm:p-10">
                <span className={text.eyebrow}>We have built this</span>
                <h2 className={cn(grotesk.h3, "mt-5 text-balance")}>
                  {project.title}
                </h2>
                <p className={cn(text.lead, "mt-4 max-w-2xl text-pretty")}>
                  {project.summary}
                </p>
                <div className="mt-8">
                  <Button
                    href={caseStudyPath(project.id)}
                    variant="secondary"
                    icon="arrowRight"
                  >
                    Read the case study
                  </Button>
                </div>
              </Card>
            </Reveal>
          </Container>
        </section>
      ) : null}

      <ReviewsSection />

      {/* Questions. The same content as the route's structured data, and
          deliberately so — Google requires FAQ markup to match what a reader
          can actually see, and the two drifting apart is a manual-action risk
          rather than a technicality. */}
      <section className={layout.sectionY}>
        <Container>
          <SectionHeading
            eyebrow="Questions"
            title="Common questions"
            description="The things people ask before they get in touch. If yours is not here, ask us directly — we answer these the same way on a call."
          />

          <Reveal>
            <Accordion
              items={page.faqs}
              defaultOpenFirst
              className="max-w-3xl"
            />
          </Reveal>
        </Container>
      </section>

      {/* Cross-links. Not decoration: these are how a cluster of pages passes
          standing between its members, and a landing page reachable only from
          the footer accumulates very little of it. */}
      {siblings.length > 0 ? (
        <section className={layout.sectionY}>
          <Container>
            <SectionHeading eyebrow="Related" title="You might also need" />

            <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {siblings.map((sibling) => (
                <RevealItem key={sibling.id} variant="scaleIn">
                  <Link
                    href={landingPath(sibling.section, sibling.id)}
                    className="block h-full"
                  >
                    <Card interactive className="h-full">
                      <Icon
                        name={sibling.icon}
                        size={22}
                        className="text-brand-soft"
                      />
                      <h3 className={cn(grotesk.h4, "mt-5 text-pretty")}>
                        {sibling.title}
                      </h3>
                      <p className={cn(text.small, "mt-3 text-pretty")}>
                        {sibling.summary}
                      </p>
                    </Card>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>
      ) : null}

    </main>
  );
}
