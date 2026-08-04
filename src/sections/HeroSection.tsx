import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { SECTION_IDS, primaryCta, secondaryCta } from "@/constants/navigation";
import { contact } from "@/constants/site";

/**
 * Hero section.
 *
 * Layered back to front: grid → brand bloom → 3D canvas → content. The canvas sits
 * behind the copy and is `pointer-events: none`, so the headline stays selectable
 * and the CTAs stay clickable while the object still reacts to the pointer.
 *
 * `min-h-svh` rather than `min-h-screen`: on mobile browsers `100vh` includes the
 * retracting URL bar, which pushes the CTAs below the fold on first paint.
 */
export function HeroSection() {
  return (
    <section
      id={SECTION_IDS.hero}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-[var(--nav-height)]"
    >
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <div aria-hidden className="bg-brand-glow absolute inset-0" />

      {/* 3D object. Decides for itself whether WebGL is worth running. */}
      <HeroCanvas className="opacity-90" />

      <Container className="relative z-10 py-20">
        <div className="max-w-4xl">
          <Reveal variant="fadeDown">
            <span className={cn(text.eyebrow, "inline-flex items-center gap-2.5")}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              Product engineering · {contact.regions.join(" & ")}
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className={cn(grotesk.display, "mt-7 text-balance")}>
              We build scalable{" "}
              <span className="text-gradient-brand">SaaS platforms</span> that
              transform how businesses operate
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className={cn(text.lead, "mt-7 max-w-2xl text-pretty")}>
              Softaura Technology is a product engineering team building
              multi-tenant SaaS, enterprise web systems and AI-powered software —
              architected for scale from the first commit, not retrofitted after
              it hurts.
            </p>
          </Reveal>

          <RevealGroup delay={0.24} className="mt-10 flex flex-wrap items-center gap-4">
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

          {/* Qualification signals. Factual claims only — capabilities and
              regions, not unverified client counts or award badges. */}
          <RevealGroup
            delay={0.36}
            as="ul"
            className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-border-subtle pt-8 text-sm text-subtle"
          >
            {[
              "Multi-tenant SaaS architecture",
              "Enterprise ERP & internal tools",
              "AI features on your own data",
              "Long-term support under SLA",
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
