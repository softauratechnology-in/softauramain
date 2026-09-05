import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechStackCard } from "@/components/cards/TechStackCard";
import { techCategories, allTechnologyNames } from "@/data/technologies";
import { SECTION_IDS } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * How we build.
 *
 * Framed as an answer to "will this hold up?" rather than as a stack list. Tool
 * names still appear — a technical evaluator on the buying side will look for
 * them, and their absence reads as evasion — but they are demoted to supporting
 * detail behind a plain statement of what each layer is responsible for.
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
          eyebrow="How we build"
          title="Boring technology, chosen on purpose"
          description="You should not have to evaluate our tools — that is our job. But if someone technical on your side wants to look, here is what we use and, more usefully, what each part is responsible for."
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
