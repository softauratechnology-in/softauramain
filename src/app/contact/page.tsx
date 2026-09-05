import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactSection } from "@/sections/ContactSection";
import { BookingEmbed } from "@/components/BookingEmbed";
import { Reveal } from "@/components/ui/Reveal";
import { routes } from "@/constants/navigation";
import { contact } from "@/constants/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Tell us what you are trying to fix. We work with businesses and schools across ${contact.regions.join(" and ")}, and reply ${contact.responseTime}.`,
  alternates: { canonical: routes.contact },
};

/**
 * Contact page.
 *
 * The booking card sits above the form deliberately: someone who already wants
 * to talk should not have to scroll past a five-field form to find out they can
 * just call.
 */
export default function ContactPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Contact"
        title={[{ text: "Start a" }, { text: "conversation", accent: true }]}
        description={`No sales script and no obligation. Tell us roughly what you need and we will give you an honest answer — including if it is not something we should take on. We reply ${contact.responseTime}.`}
      />

      <Container>
        <Reveal>
          <BookingEmbed />
        </Reveal>
      </Container>

      <ContactSection />
    </main>
  );
}
