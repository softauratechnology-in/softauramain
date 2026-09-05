import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { primaryServices } from "@/data/services";
import { SECTION_IDS, routes } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * Services, on the home page.
 *
 * The four primary services only, and no supporting tier — the home page's job
 * is to establish what we do in one screen and send the reader to `/services`
 * for the detail, not to be a second copy of that page.
 */
export function ServicesTeaser() {
  return (
    <section id={SECTION_IDS.services} className={layout.sectionY}>
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Software built around your business"
          description="Whether you are selling software to your own customers or trying to get your organisation off spreadsheets, the work is the same: understand how it really runs, then build something that fits."
          action={
            <Button href={routes.services} variant="secondary" icon="arrowRight">
              All services
            </Button>
          }
        />

        {/* Two columns, not four: there are exactly four primary services and
            two of them are `featured`. On a four-column grid the featured pair
            spans the first row and the other two sit in a half-empty second
            row. A 2×2 gives every card the same width and no gap. */}
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {primaryServices.map((service) => (
            <RevealItem key={service.id} variant="scaleIn">
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
