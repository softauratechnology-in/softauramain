import Image from "next/image";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { StarRating } from "@/components/ui/StarRating";
import type { Review } from "@/data/reviews";

export interface ReviewCardProps {
  review: Review;
  className?: string;
}

/** First letters of the first two words — the avatar fallback. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/**
 * A client review, in the shape readers already know from a Business Profile:
 * avatar and name at the top, rating beneath, then the text.
 *
 * Marked up as `<figure>` + `<blockquote>` + `<figcaption>` so the attribution
 * is programmatically tied to the quote rather than merely sitting next to it.
 * The avatar is optional and degrades to initials, so a reviewer without a
 * photo never leaves a broken image frame.
 *
 * Borrowing a familiar visual convention only works while the content behind it
 * is genuine — see the header of `src/data/reviews.ts` for why this renders
 * nothing until it is.
 */
export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <Card
      as="figure"
      variant="glass"
      /* Not `justify-between`. Spreading the three blocks apart pushes a short
         review's text to the bottom of the card while a long one packs at the
         top, so consecutive carousel slides appear to shift their content up
         and down. Stacked from the top, the name, stars and first line land on
         the same baseline whatever the quote length, and the slack falls at
         the end where nobody is reading. */
      className={cn("w-[19rem] shrink-0 sm:w-[22rem]", className)}
    >
      <figcaption className="flex items-center gap-3.5">
        {review.avatar ? (
          <Image
            src={review.avatar}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-hover text-sm font-semibold text-brand-soft"
          >
            {initials(review.author)}
          </span>
        )}

        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-foreground">
            {review.author}
          </span>
          {review.role || review.company ? (
            <span className="truncate text-xs text-subtle">
              {[review.role, review.company].filter(Boolean).join(", ")}
            </span>
          ) : null}
        </span>

        {review.sourceUrl ? (
          <a
            href={review.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Read ${review.author}'s review at the source`}
            className="ml-auto text-subtle transition-colors duration-200 hover:text-foreground"
          >
            <Icon name="arrowUpRight" size={16} />
          </a>
        ) : null}
      </figcaption>

      <div className="mt-5 flex items-center gap-3">
        <StarRating rating={review.rating} />
        {review.date ? (
          <span className="text-xs text-subtle">{review.date}</span>
        ) : null}
      </div>

      {/* Bounded, but generously. The full text stays in the DOM either way —
          the clamp is `-webkit-line-clamp`, so assistive tech and search
          engines lose nothing and only the visual height is capped.

          It was eight lines when these sat in a marquee row, where
          `items-stretch` meant one long review set the height of every card
          beside it. That row is gone; the card now lives in a carousel showing
          one slide at a time, so the only thing a cap protects is the jump
          between slides of different lengths. Fourteen lines fits a typical
          Google review whole — a reader should not have to leave the site to
          finish a sentence about it — while still stopping an outlier from
          making the controls below leap down the page. */}
      <blockquote className="mt-4 line-clamp-[14] text-pretty text-sm leading-relaxed text-muted">
        {review.quote}
      </blockquote>
    </Card>
  );
}
