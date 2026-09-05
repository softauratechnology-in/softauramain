import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedHeadline } from "@/components/ui/AnimatedHeadline";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { SECTION_IDS, primaryCta, secondaryCta } from "@/constants/navigation";
import { contact } from "@/constants/site";

/**
 * Hero section.
 *
 * Layered back to front: grid → brand bloom → animated backdrop → content. The
 * backdrop is `pointer-events: none` and `aria-hidden`, so the headline stays
 * selectable and the CTAs stay clickable.
 *
 * `min-h-svh` rather than `min-h-screen`: on mobile browsers `100vh` includes
 * the retracting URL bar, which pushes the CTAs below the fold on first paint.
 */
export function HeroSection() {
  return (
    <section
      id={SECTION_IDS.hero}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-[var(--nav-height)]"
    >
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <div aria-hidden className="bg-brand-glow absolute inset-0" />

      <HeroBackdrop />

      <Container className="relative z-10 py-20">
        <div className="max-w-4xl">
          <Reveal variant="fadeDown">
            <span className={cn(text.eyebrow, "inline-flex items-center gap-2.5")}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              Software development · {contact.regions.join(" & ")}
            </span>
          </Reveal>

          <AnimatedHeadline
            delay={0.08}
            className={cn(grotesk.display, "mt-7 text-balance")}
            segments={[
              { text: "We build the software" },
              { text: "your business runs on", accent: true },
            ]}
          />

          <Reveal delay={0.4}>
            <p className={cn(text.lead, "mt-7 max-w-2xl text-pretty")}>
              Softaura Technology designs and builds custom software — SaaS
              products, ERP systems for schools and growing companies, mobile
              apps and online stores. Senior engineers, honest timelines, and a
              system that still fits you in three years.
            </p>
          </Reveal>

          <RevealGroup
            delay={0.5}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <RevealItem>
              <Button href={primaryCta.href} size="lg" icon="arrowRight">
                {primaryCta.label}
              </Button>
            </RevealItem>
            <RevealItem>
              <Button href={secondaryCta.href} size="lg" variant="secondary">
                {secondaryCta.label}
              </Button>
            </RevealItem>
          </RevealGroup>

          {/* Qualification signals. Claims about how we work — no unverified
              client counts, award badges or metrics. */}
          <RevealGroup
            delay={0.6}
            as="ul"
            className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-border-subtle pt-8 text-sm text-subtle"
          >
            {[
              "Senior engineers, no hand-offs",
              "Clear scope and timeline up front",
              "Built to grow with your business",
              "We stay on after launch",
            ].map((item) => (
              <RevealItem as="li" key={item} className="flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-brand" />
                {item}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
