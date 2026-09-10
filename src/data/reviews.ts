export interface Review {
  id: string;
  /** 1–5. Rendered as filled stars out of five. */
  rating: 1 | 2 | 3 | 4 | 5;
  /**
   * The review text exactly as the reviewer wrote it. Never paraphrased,
   * tidied or trimmed — quoting someone means quoting them. A long review is
   * clamped visually by `ReviewCard` while the full text stays in the DOM.
   */
  quote: string;
  /** Reviewer's name, exactly as it appears on the review. */
  author: string;
  /** Their role, when the review states one. */
  role?: string;
  /** Their company, when the review states one. */
  company?: string;
  /**
   * Optional avatar, as a path under `public/reviews/`. Falls back to initials.
   *
   * Must be a local path, never a remote URL. `next.config.ts` declares no
   * `images.remotePatterns`, so a `googleusercontent.com` URL here is a hard
   * render error rather than a graceful fallback — and adding that hostname
   * would break the standing rule in that file that `dangerouslyAllowSVG` only
   * stays on while every image is first-party. The sync script downloads
   * reviewer photos instead of linking them, for exactly this reason.
   */
  avatar?: string;
  /** Human-readable date shown on the card, e.g. "March 2026". */
  date?: string;
  /** Direct link to the review on the source platform, when one exists. */
  sourceUrl?: string;
}

/**
 * Client reviews, transcribed from the Google Business Profile.
 *
 * Every entry must be a real review a real person left. The card treatment
 * deliberately mimics a Business Profile review — five stars, avatar, name,
 * date — and that styling is a claim: a reader takes it to mean a verifiable
 * third-party review exists. An invented entry would make the site assert
 * something untrue about an identifiable person, and fabricated reviews are
 * independently a Google policy violation that can cost the real profile its
 * standing. `ReviewsSection` renders nothing while this array is empty, which
 * is the only guard needed and the reason the site ships safely either way.
 *
 * **Two producers, one shape.** Entries are currently transcribed by hand.
 * Once Business Profile API access is approved, `scripts/sync-reviews.mjs`
 * writes the same `Review` shape into `reviews.generated.json` and this file
 * becomes a thin typed reader over it. Nothing downstream changes, because the
 * interface above is the contract rather than the source.
 *
 * ---
 *
 * **Do not add `aggregateRating` to the JSON-LD.** An earlier note here said to
 * add it once reviews were real. That was wrong, and it is worth recording why
 * so nobody re-derives it. Google's review-snippet policy:
 *
 *   > If the entity that's being reviewed controls the reviews about itself,
 *   > their pages that use `LocalBusiness` or any other type of `Organization`
 *   > structured data are ineligible for star review feature.
 *
 * Both types are listed as valid "only for sites that capture reviews about
 * *other*" businesses. So the markup would earn no stars in search *and* would
 * be self-serving review markup the guidelines disallow. The `Organization`
 * block in `src/app/layout.tsx` stays as it is. Stars belong on the page, in
 * `ReviewCard`, where they are visibly attributed to a named reviewer.
 */
export const reviews: Review[] = [];

/** Mean rating, to one decimal. `null` when there is nothing to average. */
export const averageRating: number | null = reviews.length
  ? Math.round(
      (reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length) *
        10,
    ) / 10
  : null;
