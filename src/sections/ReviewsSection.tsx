import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MarqueeRow } from "@/components/ui/MarqueeRow";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { REVIEWS_ARE_PLACEHOLDER, reviews } from "@/data/reviews";
import { layout } from "@/styles/theme";

/**
 * Client reviews, as two counter-scrolling rows.
 *
 * Renders **nothing** until there are real reviews to show. Two independent
 * guards, matching `TestimonialsSection`: an empty list, and the explicit
 * placeholder flag. Either one alone is enough to keep the section off the
 * page, which is what makes the component safe to ship finished and unfed.
 *
 * The split into two rows is not decorative. One long row of identical cards
 * reads as a ticker to be ignored; two rows moving against each other read as
 * a wall of individual opinions, which is the impression the section is for.
 * With fewer than four reviews there is not enough to fill two rows without
 * obvious repetition, so it stays as one.
 */
export function ReviewsSection() {
  if (reviews.length === 0) return null;
  if (REVIEWS_ARE_PLACEHOLDER) return null;

  const useTwoRows = reviews.length >= 4;
  const midpoint = Math.ceil(reviews.length / 2);
  const rows = useTwoRows
    ? [reviews.slice(0, midpoint), reviews.slice(midpoint)]
    : [reviews];

  return (
    <section className={layout.sectionY}>
      <Container>
        <SectionHeading
          eyebrow="Client success"
          title="What our clients say"
          description="Reviews from the teams we have built for, in their own words."
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
    </section>
  );
}
