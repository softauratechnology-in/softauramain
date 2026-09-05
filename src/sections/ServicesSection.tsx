import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { primaryServices, supportingServices } from "@/data/services";
import { SECTION_IDS, primaryCta } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * Services, in full — the `/services` page.
 *
 * Split into two tiers rather than one grid of nine. Nine equal cards force a
 * reader to evaluate everything at once and read as a capability list; leading
 * with the four things we want to be hired for, and demoting the rest to work
 * that comes *with* an engagement, matches how a buyer actually arrives.
 *
 * The featured cards span two columns — that asymmetry is what stops the grid
 * reading as a spec sheet. The span is owned by `<ServiceCard>` via its
 * `featured` prop, so reordering `services` cannot break the layout.
 *
 * Each card carries the service `id` as an anchor, so the footer can link
 * straight to one.
 */
export function ServicesSection() {
  return (
    <section id={SECTION_IDS.services} className={layout.sectionY}>
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Four things we build"
          description="Most of our work is one of these four. If yours does not fit neatly into any of them, that is worth a conversation rather than a guess."
          action={
            <Button href={primaryCta.href} variant="secondary" icon="arrowRight">
              Talk about your project
            </Button>
          }
        />

        {/* Two columns, not four — see the note in `ServicesTeaser`: four cards
            with two of them `featured` leaves a half-empty row on a 4-col grid. */}
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {primaryServices.map((service) => (
            <RevealItem key={service.id} variant="scaleIn">
              <div id={service.id} data-anchor className="h-full">
                <ServiceCard service={service} />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="divider-fade mt-20 mb-16" aria-hidden />

        <SectionHeading
          eyebrow="Also included"
          title="The work that comes with it"
          description="These rarely arrive as a project on their own — they are the parts of building software properly that get skipped when someone is quoting to win on price."
        />

        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {supportingServices.map((service) => (
            <RevealItem key={service.id} variant="scaleIn">
              <div id={service.id} data-anchor className="h-full">
                <ServiceCard service={service} />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
