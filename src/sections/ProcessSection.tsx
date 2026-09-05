import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ProcessStepCard } from "@/components/cards/ProcessStepCard";
import { processSteps } from "@/data/process";
import { SECTION_IDS } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * Delivery process timeline.
 *
 * Staggered slightly slower than the card grids — a timeline reads top to bottom,
 * so a visible cascade reinforces the sequence rather than just decorating it.
 */
export function ProcessSection() {
  return (
    <section
      id={SECTION_IDS.process}
      className={`${layout.sectionY} border-y border-border-subtle bg-surface/30`}
    >
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="Seven steps from idea to running software"
          description="No black box. At every stage you know what is happening now, what happens next, and what you will have in your hands at the end of it."
        />

        <RevealGroup as="ol" stagger={0.1} className="mx-auto max-w-4xl">
          {processSteps.map((step, index) => (
            <RevealItem key={step.id} as="li" variant="slideInLeft">
              <ProcessStepCard
                step={step}
                index={index}
                isLast={index === processSteps.length - 1}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
