import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { MarqueeRow } from "@/components/ui/MarqueeRow";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { reviews } from "@/data/reviews";
import { googleBusinessUrl } from "@/constants/site";
import { layout } from "@/styles/theme";

/**
 * Client reviews, as counter-scrolling rows.
 *
 * Renders **nothing** when there are no reviews. That single guard is the whole
 * safety mechanism and it is enough: the section cannot appear empty, and it
 * cannot appear with content nobody wrote, because the only thing it can render
 * is whatever is in `data/reviews.ts`.
 *
 * The split into two rows is not decorative. One long row of identical cards
 * reads as a ticker to be ignored; two rows moving against each other read as
 * a wall of individual opinions, which is the impression the section is for.
 * With fewer than four reviews there is not enough to fill two rows without
 * obvious repetition, so it stays as one.
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

  const useTwoRows = reviews.length >= 4;
  const midpoint = Math.ceil(reviews.length / 2);
  const rows = useTwoRows
    ? [reviews.slice(0, midpoint), reviews.slice(midpoint)]
    : [reviews];

  return (
    <section id={id} data-anchor className={layout.sectionY}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </Container>

      {/* Full-bleed: the rows run past the container edges, which is what makes
          them read as continuing rather than as a fixed list that happens to
          be centred. */}
      <Reveal className="flex flex-col gap-5">
        {rows.map((row, index) => (
          <MarqueeRow
            key={index}
            direction={index % 2 === 1 ? "right" : "left"}
            duration={Math.max(36, row.length * 9)}
            items={row.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          />
        ))}
      </Reveal>

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
