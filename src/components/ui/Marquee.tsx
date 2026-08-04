import { cn } from "@/lib/cn";

export interface MarqueeProps {
  /** Items to scroll. Joined with `separator`. */
  items: readonly string[];
  /** Glyph between items. */
  separator?: string;
  /**
   * Seconds for one full loop. Longer lists need a longer duration or the ticker
   * reads as frantic — roughly 2s per item is a good starting point.
   */
  duration?: number;
  /** `display` for oversized statement type, `label` for a quiet tech ticker. */
  size?: "display" | "label";
  className?: string;
}

/**
 * Infinite horizontal ticker.
 *
 * The track is rendered twice and translated by exactly -50%, which is what makes
 * the loop seamless. The duplicate is `aria-hidden`, so screen readers announce
 * the list once. Pure CSS — no JS, no rAF loop — and it stops entirely under
 * `prefers-reduced-motion` via `motion-reduce:animate-none`.
 */
export function Marquee({
  items,
  separator = "•",
  duration = 40,
  size = "display",
  className,
}: MarqueeProps) {
  /* Trailing separator matters: without it the seam between the two copies is
     the only place in the loop where two items sit side by side unseparated. */
  const track = `${items.join(`  ${separator}  `)}  ${separator}  `;

  const trackClass =
    size === "display"
      ? "font-display text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
      : "text-sm font-medium tracking-[0.14em] uppercase text-subtle sm:text-base";

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-border-subtle bg-surface/50",
        size === "display" ? "py-7 sm:py-9" : "py-5",
        className,
      )}
    >
      {/* Edge fades so items enter and leave rather than popping at the bounds. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-28"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-28"
      />

      <div
        className="flex w-max animate-[marquee_var(--marquee-duration)_linear_infinite] whitespace-nowrap motion-reduce:animate-none"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <span className={cn("px-6", trackClass)}>{track}</span>
        <span aria-hidden className={cn("px-6", trackClass)}>
          {track}
        </span>
      </div>
    </div>
  );
}
