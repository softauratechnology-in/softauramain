import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { projects } from "@/data/projects";
import { SECTION_IDS, routes } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * Work, on the home page — and the page's social proof.
 *
 * Deliberately real systems rather than testimonials: the testimonial data in
 * `data/testimonials.ts` is flagged sample content (every author is literally
 * "Sample Client"), and a fabricated quote undermines the "no bait-and-switch"
 * argument the rest of the page is making. Shipped work is proof we can
 * actually stand behind.
 */
export function WorkTeaser() {
  if (projects.length === 0) return null;

  /* No tinted band here: `WhyUsSection` immediately above already carries one,
     and two banded sections in a row read as a single long block. */
  return (
    <section id={SECTION_IDS.work} className={layout.sectionY}>
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="Systems people use every day"
          description="Each of these replaced something that was being held together by spreadsheets, paper and goodwill."
          action={
            <Button href={routes.work} variant="secondary" icon="arrowRight">
              All case studies
            </Button>
          }
        />

        <RevealGroup className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <RevealItem
              key={project.id}
              variant="scaleIn"
              className={project.featured ? "lg:col-span-2" : undefined}
            >
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
