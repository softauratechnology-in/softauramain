import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import {
  testimonials,
  TESTIMONIALS_ARE_PLACEHOLDER,
} from "@/data/testimonials";
import { SECTION_IDS } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * Testimonials.
 *
 * Three safeguards, all intentional:
 *  - Empty list → the section does not render. Set `testimonials = []` to launch
 *    without this section rather than shipping filler.
 *  - `TESTIMONIALS_ARE_PLACEHOLDER` → the section does not render *at all*.
 *    Attributing invented praise to clients on a live commercial site is a
 *    fabricated endorsement, and this site argues for its own honesty
 *    elsewhere; a page that says "no bait-and-switch" above three quotes from
 *    "Sample Client" defeats itself. Real proof on the home page comes from
 *    shipped work instead (`WorkTeaser`).
 *
 * Flip `TESTIMONIALS_ARE_PLACEHOLDER` to `false` once real, approved quotes are
 * in `data/testimonials.ts`, and this section appears on its own.
 */
export function TestimonialsSection() {
  if (testimonials.length === 0) return null;
  if (TESTIMONIALS_ARE_PLACEHOLDER) return null;

  return (
    <section id={SECTION_IDS.testimonials} className={layout.sectionY}>
      <Container>
        <SectionHeading
          eyebrow="Client feedback"
          title="What partners say about working with us"
          align="center"
        />

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
