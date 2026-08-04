import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { differentiators } from "@/data/differentiators";
import { SECTION_IDS } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * "Why choose us".
 *
 * Rendered as one bordered table rather than six separate cards. The dividers are
 * drawn with `gap-px` over a border-coloured background — the classic trick that
 * gives perfect 1px internal rules with no double borders at the seams and no
 * `:last-child` exceptions to maintain.
 */
export function WhyUsSection() {
  return (
    <section
      id={SECTION_IDS.whyUs}
      className={`${layout.sectionY} border-y border-border-subtle bg-surface/30`}
    >
      <Container>
        <SectionHeading
          eyebrow="Why Softaura"
          title="Built to be a long-term engineering partner"
          description="Most vendor relationships fail on the things nobody put in the proposal. These are the commitments we make explicit up front."
        />

        <RevealGroup className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((feature, index) => (
            <RevealItem key={feature.id} className="bg-background">
              <FeatureCard feature={feature} index={index} className="h-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
