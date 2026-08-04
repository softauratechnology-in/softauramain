import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { Icon } from "@/components/ui/Icon";
import {
  testimonials,
  TESTIMONIALS_ARE_PLACEHOLDER,
} from "@/data/testimonials";
import { SECTION_IDS } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * Testimonials.
 *
 * Two safeguards, both intentional:
 *  - Empty list → the section does not render. Set `testimonials = []` to launch
 *    without this section rather than shipping filler.
 *  - `TESTIMONIALS_ARE_PLACEHOLDER` → a visible notice is rendered above the
 *    quotes. Attributing invented praise to real clients on a live commercial site
 *    is a fabricated endorsement, so the placeholder state announces itself
 *    instead of hiding. Flip the flag once real quotes are in.
 */
export function TestimonialsSection() {
  if (testimonials.length === 0) return null;

  return (
    <section id={SECTION_IDS.testimonials} className={layout.sectionY}>
      <Container>
        <SectionHeading
          eyebrow="Client feedback"
          title="What partners say about working with us"
          align="center"
        />

        {TESTIMONIALS_ARE_PLACEHOLDER ? (
          <div
            role="note"
            className="mx-auto mb-10 flex max-w-2xl items-start gap-3 rounded-card border border-warning/30 bg-warning/[0.07] p-4 text-sm text-muted"
          >
            <Icon name="quote" size={18} className="mt-0.5 shrink-0 text-warning" />
            <p>
              <strong className="font-semibold text-foreground">
                Sample content.
              </strong>{" "}
              These quotes are illustrative placeholders, not real client
              endorsements. Replace them with approved testimonials and set{" "}
              <code className="rounded bg-surface-hover px-1.5 py-0.5 text-xs">
                TESTIMONIALS_ARE_PLACEHOLDER
              </code>{" "}
              to <code className="rounded bg-surface-hover px-1.5 py-0.5 text-xs">false</code>{" "}
              in <code className="text-xs">src/data/testimonials.ts</code> before
              launch.
            </p>
          </div>
        ) : null}

        <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <RevealItem key={testimonial.id} variant="scaleIn">
              <TestimonialCard testimonial={testimonial} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
