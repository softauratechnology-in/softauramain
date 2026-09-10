import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MarqueeRowProps {
  /**
   * The items to scroll. Each is rendered twice — once for the visible track and
   * once for the hidden duplicate that makes the loop seamless — so keep them
   * cheap and side-effect free. Interactive children are safe: the duplicate is
   * `inert`, so nothing inside it is focusable or clickable.
   */
  items: readonly ReactNode[];
  /** Seconds for one full loop. Roughly 6s per card reads unhurried. */
  duration?: number;
  /** `right` runs the track the other way, for a second row under the first. */
  direction?: "left" | "right";
  /**
   * Trailing space after each item, as a Tailwind `padding-inline-end` class.
   *
   * Padding rather than a flex `gap`, and that is load-bearing. The loop works
   * by translating the pair of tracks exactly -50%, which only lands seamlessly
   * when the two copies are the same width *and* nothing sits between them. A
   * flex gap adds one extra space across the pair, so -50% falls half a gap
   * short and the seam visibly jumps once per cycle. Padding belongs to the
   * item, so every copy measures identically.
   */
  spacingClassName?: string;
  className?: string;
}

/**
 * Infinite horizontal ticker for arbitrary content.
 *
 * The sibling of `Marquee`, which takes `readonly string[]`, joins it into a
 * single string and cannot host an element. Rather than widen that component's
 * contract — its string-joining is the whole reason its separator handling is
 * as simple as it is — this is the node-shaped counterpart, using the same
 * proven mechanism.
 *
 * Pauses on hover so a reader can actually finish a card, and stops entirely
 * under `prefers-reduced-motion`, where it degrades to a plain horizontal
 * scroller the reader can move themselves.
 */
export function MarqueeRow({
  items,
  duration = 48,
  direction = "left",
  spacingClassName = "pe-5",
  className,
}: MarqueeRowProps) {
  if (items.length === 0) return null;

  const track = (
    <ul className="flex shrink-0 items-stretch">
      {items.map((item, index) => (
        <li key={index} className={cn("flex", spacingClassName)}>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "group/marquee relative overflow-hidden",
        /* Under reduced motion the animation is off, so give the reader a way
           to reach the rest of the row under their own control. */
        "motion-reduce:overflow-x-auto",
        className,
      )}
    >
      {/* Edge fades so cards enter and leave rather than popping at the bounds. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-24"
      />

      <div
        className={cn(
          "flex w-max animate-[marquee_var(--marquee-duration)_linear_infinite]",
          direction === "right" && "[animation-direction:reverse]",
          "group-hover/marquee:[animation-play-state:paused]",
          "motion-reduce:animate-none",
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {track}
        {/* `inert`, not just `aria-hidden`. `aria-hidden` removes the duplicate
            from the accessibility tree but leaves its contents in the tab
            order, so any link or button inside an item would be reachable
            twice — the second time announcing nothing, because the element it
            landed on is hidden from assistive tech. `inert` removes focus and
            pointer interaction as well, which is what actually makes the copy
            a copy. */}
        <div aria-hidden inert className="flex shrink-0">
          {track}
        </div>
      </div>
    </div>
  );
}
