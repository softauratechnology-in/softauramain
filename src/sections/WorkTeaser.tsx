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
 * Shipped systems, not claims about them. This section carried the page's
 * social proof on its own while there were no reviews to show, and it still
 * does the different job of proving we can build the thing — `ReviewsSection`
 * below proves clients were glad we did.
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
