export interface Review {
  id: string;
  /** 1–5. Rendered as filled stars out of five. */
  rating: 1 | 2 | 3 | 4 | 5;
  /**
   * The review text as the reviewer wrote it. Not edited for length — if it is
   * too long for the card, the card scrolls; the words are not trimmed.
   */
  quote: string;
  /** Reviewer's name, exactly as it appears on the review. */
  author: string;
  /** Their role, when the review states one. */
  role?: string;
  /** Their company, when the review states one. */
  company?: string;
  /** Optional avatar in `public/reviews/`. Falls back to initials. */
  avatar?: string;
  /** Human-readable date shown on the card, e.g. "March 2026". */
  date?: string;
  /** Direct link to the review on the source platform, when one exists. */
  sourceUrl?: string;
}

/**
 * Client reviews.
 *
 * ⚠️ EMPTY BY DESIGN — this section is built but not yet live.
 *
 * The card treatment deliberately mimics a Google Business Profile review:
 * five-star rating, avatar, name, date. That styling is a claim — a reader
 * takes it to mean a real customer left a verifiable review on a third-party
 * platform. Writing entries here that no customer wrote would make the site
 * assert something untrue about identifiable people, and fabricated reviews are
 * independently a violation of Google's policies that can cost the real
 * Business Profile its standing.
 *
 * So the component ships finished and the data ships empty. `ReviewsSection`
 * renders nothing at all while `REVIEWS_ARE_PLACEHOLDER` is `true` or this
 * array is empty, which is why the site is shippable in this state.
 *
 * To go live:
 *   1. Collect real reviews — Google Business Profile, or written and approved
 *      directly by the client.
 *   2. Add them below, transcribed rather than rewritten.
 *   3. Set `REVIEWS_ARE_PLACEHOLDER` to `false`. The section appears.
 *
 * One further step belongs with (3), not before it: `aggregateRating` in the
 * JSON-LD. Structured ratings are the version search engines act on, so that
 * markup must not be emitted until the ratings behind it are real. See the
 * note in `src/app/layout.tsx`.
 */
export const REVIEWS_ARE_PLACEHOLDER = true;

export const reviews: Review[] = [];

/** Mean rating, to one decimal. `null` when there is nothing to average. */
export const averageRating: number | null = reviews.length
  ? Math.round(
      (reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length) *
        10,
    ) / 10
  : null;
