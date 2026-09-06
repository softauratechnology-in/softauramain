import type { Metadata } from "next";
import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/sections/CtaSection";
import { faqGroups, faqItems } from "@/data/faq";
import { primaryCta, routes } from "@/constants/navigation";
import { layout } from "@/styles/theme";

export const metadata: Metadata = {
  title: "Common questions",
  description:
    "Straight answers on custom ERP versus off-the-shelf software, how long enterprise software takes to build, what it costs, data security, and who owns the code.",
  alternates: { canonical: routes.faq },
};

/**
 * FAQ page.
 *
 * Two things here are load-bearing beyond the visible page:
 *
 *  1. **Every answer is in the HTML**, open or closed, because the accordion is
 *     a native `<details>`. A JavaScript accordion that mounts its answers on
 *     click hides them from anything that does not execute scripts — which
 *     includes a good deal of what now reads pages on a searcher's behalf.
 *  2. **`FAQPage` structured data**, built from the same `faqGroups` the page
 *     renders. Deriving both from one source is the point: hand-maintained
 *     JSON-LD drifts from the visible copy, and structured data that disagrees
 *     with the page is worse than none.
 */
export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main id="main">
      {/*
       * `JSON.stringify` does not escape markup, so a `<` arriving from content
       * could close this script tag early. Replacing it with its unicode escape
       * is the mitigation the Next.js JSON-LD guide prescribes.
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageHeader
        eyebrow="Common questions"
        title={[{ text: "Questions we are" }, { text: "asked most", accent: true }]}
        description="Honest answers, including where the honest answer is that it depends. If what you need to know is not here, ask us directly — we would rather answer than have you guess."
        action={
          <Button href={primaryCta.href} icon="arrowRight">
            {primaryCta.label}
          </Button>
        }
      />

      <section className={layout.sectionY}>
        {/* Default container width with a left-aligned reading column, rather
            than `width="prose"` — that centres its column, which would leave
            the questions floating out of line with the page heading above. */}
        <Container>
          {/* Category tiles. Thirteen questions in one column opens as a wall
              of text with no way in; four tiles give the reader the shape of
              the page and a jump straight to the part they came for. Anchor
              links, so they work with JavaScript off and are shareable. */}
          <RevealGroup className="mb-14 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {faqGroups.map((group) => (
              <RevealItem key={group.id} variant="scaleIn" className="flex">
                <a
                  href={`#${group.id}`}
                  className="surface-glass group/tile flex w-full flex-col rounded-card p-5 backdrop-blur-[var(--glass-blur)] transition-colors duration-350 ease-out-expo hover:bg-surface-hover supports-[not(backdrop-filter:blur(0))]:bg-surface"
                >
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface text-brand-soft">
                    <Icon name={group.icon} size={18} />
                  </span>

                  <span className="text-sm font-semibold text-foreground">
                    {group.heading}
                  </span>
                  <span className="mt-1.5 text-xs leading-relaxed text-subtle">
                    {group.blurb}
                  </span>

                  <span className="mt-4 flex items-center gap-1.5 text-xs font-medium text-brand-strong">
                    {group.items.length} questions
                    <Icon
                      name="arrowRight"
                      size={13}
                      className="transition-transform duration-350 ease-out-expo group-hover/tile:translate-x-1"
                    />
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="max-w-3xl space-y-16">
            {faqGroups.map((group, index) => (
              <div key={group.id} id={group.id} data-anchor>
                <Reveal>
                  <h2 className={cn(text.h3, "text-balance")}>{group.heading}</h2>
                </Reveal>

                <Accordion
                  items={group.items}
                  /* Only the very first answer opens, so a reader landing cold
                     can see the shape of an answer without a click. */
                  defaultOpenFirst={index === 0}
                  className="mt-4"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection />
    </main>
  );
}
