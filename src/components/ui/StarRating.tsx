import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

/**
 * A five-star rating.
 *
 * The whole row carries one label ("Rated 5 out of 5") and the stars themselves
 * are hidden, so a screen reader announces the score once instead of reading
 * five identical glyphs. Empty stars are drawn rather than omitted — a row of
 * three stars is ambiguous, three-of-five is not.
 */

/* Google's review amber. Not a theme token on purpose: it identifies the
   convention being borrowed, so it must survive a palette change. It happens to
   match `--warning`, which is a coincidence and not a semantic use. */
const STAR_GOLD = "#FBBF24";

const TOTAL = 5;

export interface StarRatingProps {
  /** 1–5. */
  rating: number;
  /** Rendered star size in px. */
  size?: number;
  className?: string;
}

export function StarRating({ rating, size = 16, className }: StarRatingProps) {
  const filled = Math.round(Math.min(Math.max(rating, 0), TOTAL));

  return (
    <span
      role="img"
      aria-label={`Rated ${rating} out of ${TOTAL}`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: TOTAL }, (_, index) => (
        <Icon
          key={index}
          name="star"
          size={size}
          style={index < filled ? { color: STAR_GOLD } : undefined}
          className={index < filled ? undefined : "text-border-strong"}
        />
      ))}
    </span>
  );
}
