import { HeroSection } from "@/sections/HeroSection";
import { ServicesSection } from "@/sections/ServicesSection";
import { WhyUsSection } from "@/sections/WhyUsSection";
import { WorkSection } from "@/sections/WorkSection";
import { TechnologySection } from "@/sections/TechnologySection";
import { ProcessSection } from "@/sections/ProcessSection";
import { TestimonialsSection } from "@/sections/TestimonialsSection";
import { ContactSection } from "@/sections/ContactSection";
import { Marquee } from "@/components/ui/Marquee";
import { services } from "@/data/services";

/**
 * Home page.
 *
 * Purely compositional — every section owns its own content, data and animation,
 * so the page reads as the site's narrative order and nothing else:
 *
 *   hook → what we do → why us → proof → how we work → social proof → convert
 *
 * The marquee between hero and services is the one piece of layout that lives
 * here, because it belongs to the seam between two sections rather than to either.
 */
export default function HomePage() {
  return (
    <main id="main">
      <HeroSection />

      <Marquee items={services.map((service) => service.title)} duration={45} />

      <ServicesSection />
      <WhyUsSection />
      <WorkSection />
      <TechnologySection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
