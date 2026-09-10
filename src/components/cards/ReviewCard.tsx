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
      /* Not `justify-between`. Cards in a marquee row are stretched to a common
         height, so spreading the three blocks apart pushes a short review's
         text to the bottom of its card while a long one sits packed at the top
         — the row then reads as misaligned rather than as a set. Stacked from
         the top, every card's name, stars and first line land on the same
         baseline whatever the quote length, and the slack falls at the end. */
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

      {/* Clamped to eight lines, and the full text stays in the DOM — the
          clamp is `-webkit-line-clamp`, so assistive tech and search engines
          still get every word, and only the visual height is bounded.

          It has to be bounded. Google reviews are unbounded in length, the
          marquee row is `items-stretch`, and every card here is a fixed width
          — so without this a single long review sets the height of every other
          card in its row and the section grows a band of empty glass. */}
      <blockquote className="mt-4 line-clamp-8 text-pretty text-sm leading-relaxed text-muted">
        {review.quote}
      </blockquote>
    </Card>
  );
}
