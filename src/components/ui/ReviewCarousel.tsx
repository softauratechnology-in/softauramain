"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ReviewCard } from "@/components/cards/ReviewCard";
import type { Review } from "@/data/reviews";
import { transitions } from "@/animations/variants";

/**
 * Reviews, one at a time, with prev/next.
 *
 * Replaces the marquee that used to render this section. A ticker needs a
 * crowd to read as a crowd — with one or two reviews it loops visibly and looks
 * broken, and this site is going to have a handful of reviews for a long time.
 * A carousel is honest at any count, including one.
 *
 * **Nav buttons are `<Button variant="secondary">`, not hand-rolled.** That
 * variant already implements the house rule — transparent at rest with a brand
 * hairline, solid `brand-600` fill with white glyph on hover *and* focus — and
 * two things in it are easy to get wrong when reimplementing: the fill and the
 * glyph colour flip in the same beat so the icon never strands mid-transition
 * against a colour it cannot be read on, and the fill is `brand-600` rather
 * than `-500` because white has to clear AA against it. It also brings
 * `active:scale-[0.97]`, the sweep press effect, and `disabled:opacity-50`,
 * which is what the bounds of a non-looping carousel need.
 *
 * Motion: `AnimatePresence` with `mode="wait"` so the outgoing slide clears
 * before the incoming one arrives — with `mode="sync"` two absolutely-unpositioned
 * cards briefly occupy the same row and the container jumps. Direction is
 * tracked so the slide always travels the way the reader asked it to.
 *
 * Reduced motion needs no branch: `MotionProvider` sets `reducedMotion="user"`
 * globally, so Framer drops the x-transform and cross-fades instead.
 */

export interface ReviewCarouselProps {
  reviews: readonly Review[];
  className?: string;
}

/** How far a card travels in/out, in px. */
const SLIDE_DISTANCE = 48;

/** Minimum horizontal travel before a touch drag counts as a swipe. */
const SWIPE_THRESHOLD = 60;

export function ReviewCarousel({ reviews, className }: ReviewCarouselProps) {
  const [index, setIndex] = useState(0);
  /* +1 travelling forward, -1 back. Drives which side a card enters from. */
  const [direction, setDirection] = useState(1);
  const regionRef = useRef<HTMLDivElement>(null);
  const liveId = useId();

  const count = reviews.length;
  const multiple = count > 1;

  const go = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex(((next % count) + count) % count);
    },
    [index, count],
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  /* Arrow keys, but only while focus is inside the carousel — a global listener
     would hijack the arrow keys for the whole page. */
  useEffect(() => {
    if (!multiple) return;
    const region = regionRef.current;
    if (!region) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      }
    };

    region.addEventListener("keydown", onKeyDown);
    return () => region.removeEventListener("keydown", onKeyDown);
  }, [multiple, prev, next]);

  if (count === 0) return null;

  const review = reviews[index];

  return (
    <div
      ref={regionRef}
      /* `aria-roledescription` names the widget; the group role plus a label is
         what lets a screen reader announce "carousel, 1 of 3" rather than
         reading a bare figure with no context. */
      role="group"
      aria-roledescription="carousel"
      aria-label="Client reviews"
      /* Left-aligned, not centred. The section heading above sits on the
         container's left edge like every other section on the site, and a
         centred card under a left-aligned heading reads as a layout mistake
         rather than a choice — especially at one review, where the gutter is
         most of the row. */
      className={cn("flex flex-col items-start gap-7", className)}
    >
      {/* The card owns its own width; this row just holds the slot so the
          controls below keep their position between slides. */}
      <div className="flex w-full justify-start">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={review.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * SLIDE_DISTANCE }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -SLIDE_DISTANCE }}
            transition={transitions.base}
            /* Touch drag. `dragElastic: 0` keeps the card from rubber-banding
               past its own bounds, which on a fixed-width card reads as a bug
               rather than as affordance. */
            drag={multiple ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) next();
              else if (info.offset.x > SWIPE_THRESHOLD) prev();
            }}
            className={multiple ? "cursor-grab active:cursor-grabbing" : undefined}
          >
            <ReviewCard review={review} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* One review is not a carousel — no controls, no dots, no count. */}
      {multiple ? (
        <div className="flex items-center gap-4">
          <NavButton
            label="Previous review"
            icon="chevronLeft"
            onClick={prev}
          />

          {/* Dots double as direct navigation. Labelled individually so the
              control is usable without seeing which one is filled. */}
          <div className="flex items-center gap-2">
            {reviews.map((entry, dotIndex) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => go(dotIndex)}
                aria-label={`Show review ${dotIndex + 1} of ${count}`}
                aria-current={dotIndex === index ? "true" : undefined}
                className={cn(
                  "h-2 rounded-full transition-all duration-350 ease-out-expo",
                  dotIndex === index
                    ? "w-6 bg-brand-strong"
                    : "w-2 bg-border-strong hover:bg-subtle",
                )}
              />
            ))}
          </div>

          <NavButton label="Next review" icon="chevronRight" onClick={next} />
        </div>
      ) : null}

      {/* Announces the change to screen readers without moving focus. The
          visible card is not itself a live region — that would re-read the
          whole quote on every press. */}
      <span id={liveId} aria-live="polite" className="sr-only">
        {multiple ? `Review ${index + 1} of ${count}` : null}
      </span>
    </div>
  );
}

/**
 * A circular icon-only nav control.
 *
 * `size="icon"` is a real entry in `Button`'s size map, not a `className`
 * override — `cn()` has no tailwind-merge, so a `px-0` passed in would sit
 * beside the variant's own `px-4` and the winner would be decided by
 * stylesheet order rather than by argument order.
 */
function NavButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: "chevronLeft" | "chevronRight";
  onClick: () => void;
}) {
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={onClick}
      aria-label={label}
    >
      <Icon name={icon} size={18} />
    </Button>
  );
}
