import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { ReviewCarousel } from "@/components/ui/ReviewCarousel";
import { reviews } from "@/data/reviews";
import { googleBusinessUrl } from "@/constants/site";
import { layout } from "@/styles/theme";

/**
 * Client reviews, as a carousel.
 *
 * Renders **nothing** when there are no reviews. That single guard is the whole
 * safety mechanism and it is enough: the section cannot appear empty, and it
 * cannot appear with content nobody wrote, because the only thing it can render
 * is whatever is in `data/reviews.ts`.
 *
 * This used to be a pair of counter-scrolling marquee rows, which was the right
 * shape for a wall of opinions and the wrong one for the number of reviews that
 * actually exist. A ticker needs a crowd to read as a crowd; with one or two
 * cards it loops visibly and reads as broken. A carousel is honest at any count
 * and hides its own controls at one.
 *
 * Headings are props because this renders on two pages with different jobs. On
 * the home page it is one proof point among several; above the contact form it
 * is the last thing read before someone decides whether to send an enquiry, and
 * should say so.
 */

export interface ReviewsSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function ReviewsSection({
  id = "reviews",
  eyebrow = "Client success",
  title = "What our clients say",
  description = "Reviews left on our Google Business Profile, in our clients' own words.",
}: ReviewsSectionProps = {}) {
  if (reviews.length === 0) return null;

  return (
    <section id={id} data-anchor className={layout.sectionY}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <Reveal>
          <ReviewCarousel reviews={reviews} />
        </Reveal>
      </Container>

      {/* The point of quoting reviews is that they can be checked. Omitted
          rather than dead when the profile URL is not set — see `site.ts`. */}
      {googleBusinessUrl ? (
        <Container className="mt-10">
          <Reveal>
            <a
              href={googleBusinessUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group/all inline-flex items-center gap-2 text-sm font-medium text-brand-strong transition-colors duration-200 hover:text-foreground"
            >
              See all reviews on Google
              <Icon
                name="arrowUpRight"
                size={16}
                className="transition-transform duration-350 ease-out-expo group-hover/all:-translate-y-0.5 group-hover/all:translate-x-0.5"
              />
            </a>
          </Reveal>
        </Container>
      ) : null}
    </section>
  );
}
