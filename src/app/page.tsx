import { HeroSection } from "@/sections/HeroSection";
import { StatsSection } from "@/sections/StatsSection";
import { ServicesTeaser } from "@/sections/ServicesTeaser";
import { WhyUsSection } from "@/sections/WhyUsSection";
import { WorkTeaser } from "@/sections/WorkTeaser";
import { FaqTeaser } from "@/sections/FaqTeaser";
import { ReviewsSection } from "@/sections/ReviewsSection";
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
 * `ReviewsSection` is mounted whether or not there are reviews to show: it
 * renders nothing while `data/reviews.ts` is empty, and appears on its own the
 * moment a review is added, with no edit to this file.
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

      <StatsSection />
      <ServicesTeaser />
      <WhyUsSection />
      <WorkTeaser />
      <ReviewsSection />
      <FaqTeaser />
    </main>
  );
}
