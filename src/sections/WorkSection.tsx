import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { projects } from "@/data/projects";
import { SECTION_IDS, primaryCta } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * Case studies grid.
 *
 * Renders nothing when `projects` is empty rather than showing an empty section —
 * a "Selected work" heading over blank space is worse than no section at all.
 *
 * The first card gets `priority` on its image: it is the only one likely to be
 * near the fold on a tall desktop viewport, and marking more than one defeats the
 * purpose by competing for the same early bandwidth.
 */
export function WorkSection() {
  if (projects.length === 0) return null;

  return (
    <section
      id={SECTION_IDS.work}
      className={`${layout.sectionY} border-t border-border-subtle`}
    >
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="Systems in production"
          description="A selection of platforms we have designed, built and shipped. Detailed walkthroughs are available under NDA on request."
          action={
            <Button href={primaryCta.href} variant="secondary" icon="arrowRight">
              Request a walkthrough
            </Button>
          }
        />

        <RevealGroup className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {projects.map((project, index) => (
            <RevealItem
              key={project.id}
              variant="scaleIn"
              className={project.featured ? "lg:col-span-2" : undefined}
            >
              <ProjectCard project={project} priority={index === 0} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
