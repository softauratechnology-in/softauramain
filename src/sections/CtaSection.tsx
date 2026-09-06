import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SystemDiagram } from "@/components/visuals/SystemDiagram";
import { primaryCta, routes } from "@/constants/navigation";
import { contact } from "@/constants/site";
import { layout } from "@/styles/theme";

/**
 * Closing call to action.
 *
 * The last thing on every page that is not `/contact` itself. Sits on a frosted
 * panel over the brand bloom rather than a flat band, so it reads as a
 * destination rather than one more section.
 *
 * The reassurance line under the buttons is doing real work: the most common
 * reason someone does not click a "book a call" button is not knowing what they
 * are agreeing to, so it says what happens next and what it costs.
 */
export function CtaSection() {
  return (
    <section className={cn(layout.sectionY, "relative overflow-hidden")}>
      <div aria-hidden className="bg-brand-glow absolute inset-0" />

      <Container className="relative">
        <Reveal>
          <div className="surface-glass rounded-card px-6 py-14 backdrop-blur-[var(--glass-blur)] supports-[not(backdrop-filter:blur(0))]:bg-surface sm:px-12 sm:py-20">
            {/* Two columns from `lg`, where the panel is otherwise a wide band
                of centred text with a great deal of empty glass either side. */}
            <div className="mx-auto grid max-w-2xl items-center gap-12 text-center lg:max-w-none lg:grid-cols-5 lg:gap-16 lg:text-left">
              <div className="lg:col-span-3">
                <h2 className={cn(grotesk.h2, "text-balance")}>
                  Tell us what you are trying to fix
                </h2>

                <p className={cn(text.lead, "mt-6 text-pretty text-muted")}>
                  Describe the problem in your own words — you do not need a
                  specification, or to know what the solution should be. We will
                  tell you honestly whether it is something we can help with.
                </p>

                <RevealGroup
                  delay={0.1}
                  className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
                >
                  <RevealItem>
                    <Button href={primaryCta.href} size="lg" icon="arrowRight">
                      {primaryCta.label}
                    </Button>
                  </RevealItem>
                  <RevealItem>
                    <Button href={routes.faq} size="lg" variant="secondary">
                      Read common questions
                    </Button>
                  </RevealItem>
                </RevealGroup>

                <p className="mt-8 text-sm text-subtle">
                  No cost, no obligation. We reply {contact.responseTime}.
                </p>
              </div>

              {/* Decorative. Abstract on purpose — see the note in the
                  component about why this is not a mock dashboard. */}
              <SystemDiagram className="mx-auto w-full max-w-xs lg:col-span-2 lg:max-w-none" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
