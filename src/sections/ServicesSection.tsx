import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { services } from "@/data/services";
import { SECTION_IDS, primaryCta } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * Services grid.
 *
 * A four-column grid on wide screens with featured cards spanning two — that
 * asymmetry is what stops eight equal cards reading as a spec sheet. The span is
 * owned by `<ServiceCard>` via its `featured` prop, so reordering `services`
 * cannot break the layout.
 */
export function ServicesSection() {
  return (
    <section id={SECTION_IDS.services} className={layout.sectionY}>
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Engineering services, end to end"
          description="One team from discovery through to long-term support. Engage us for a whole product or a single capability your roadmap is missing."
          action={
            <Button href={primaryCta.href} variant="secondary" icon="arrowRight">
              Discuss your project
            </Button>
          }
        />

        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <RevealItem
              key={service.id}
              variant="scaleIn"
              className={service.featured ? "lg:col-span-2" : undefined}
            >
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
