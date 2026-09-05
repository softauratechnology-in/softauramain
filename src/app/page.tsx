import { HeroSection } from "@/sections/HeroSection";
import { ServicesTeaser } from "@/sections/ServicesTeaser";
import { WhyUsSection } from "@/sections/WhyUsSection";
import { WorkTeaser } from "@/sections/WorkTeaser";
import { TestimonialsSection } from "@/sections/TestimonialsSection";
import { CtaSection } from "@/sections/CtaSection";
import { Marquee } from "@/components/ui/Marquee";
import { primaryServices } from "@/data/services";

/**
 * Home page.
 *
 * Purely compositional — every section owns its own content, data and animation,
 * so the page reads as the site's narrative order and nothing else:
 *
 *   hook → what we do → why us → proof → convert
 *
 * Each middle section is a *teaser* that ends in a link to the page which
 * carries the detail. The home page's job is to get a stranger to the right
 * page, not to be every page at once.
 *
 * `TestimonialsSection` renders nothing while the testimonial data is still
 * flagged as sample content — it appears here automatically once real quotes
 * replace it.
 *
 * The marquee between hero and services is the one piece of layout that lives
 * here, because it belongs to the seam between two sections rather than to
 * either.
 */
export default function HomePage() {
  return (
    <main id="main">
      <HeroSection />

      <Marquee
        items={primaryServices.map((service) => service.title)}
        duration={45}
      />

      <ServicesTeaser />
      <WhyUsSection />
      <WorkTeaser />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
