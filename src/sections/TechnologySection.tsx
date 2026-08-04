import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechStackCard } from "@/components/cards/TechStackCard";
import { techCategories, allTechnologyNames } from "@/data/technologies";
import { SECTION_IDS } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * Technology stack.
 *
 * The marquee below the grid is deliberately the quiet `label` size — a second
 * oversized ticker on the same page would compete with the services marquee for
 * attention. Its duration scales with the number of technologies so adding one
 * does not speed the whole loop up.
 */
export function TechnologySection() {
  return (
    <section id={SECTION_IDS.technology} className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-30" />

      <Container className={`relative ${layout.sectionY}`}>
        <SectionHeading
          eyebrow="Our stack"
          title="Proven technology, chosen per problem"
          description="We are opinionated about engineering quality and flexible about tools. Here is what we reach for most, and what each layer is responsible for."
        />

        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {techCategories.map((category) => (
            <RevealItem key={category.id} variant="scaleIn">
              <TechStackCard category={category} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>

      <Marquee
        items={allTechnologyNames}
        size="label"
        separator="/"
        /* ~1.6s per item keeps the reading speed constant as the list grows. */
        duration={Math.max(30, allTechnologyNames.length * 1.6)}
      />
    </section>
  );
}
