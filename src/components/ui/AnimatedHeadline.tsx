"use client";

import { Fragment, type ComponentType } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/cn";
import { headlineWord, staggerContainer } from "@/animations/variants";

/**
 * Word-by-word headline reveal.
 *
 * `headlineWord` in `animations/variants.ts` has supplied the per-word timing
 * since the first build and documented that splitting was the caller's job —
 * this is that caller.
 *
 * **Accessibility.** Splitting text into one element per word is the usual way
 * this effect breaks screen readers: some announce each fragment as its own
 * phrase, turning a headline into a word list. So the real sentence goes on the
 * heading as `aria-label` and every visual word is hidden from the
 * accessibility tree. Assistive tech reads one heading; sighted users get the
 * stagger.
 *
 * Reduced motion needs no branch: `MotionProvider` sets `reducedMotion="user"`
 * globally, so Framer drops the `y` transform and keeps the fade.
 */

/**
 * Motion-wrapped headings, built once at module scope.
 *
 * Same reasoning as `MOTION_TAGS` in `Reveal.tsx`: `motion.create()` returns a
 * new component type per call, so building one during render would remount the
 * subtree — and discard the animation mid-flight — on every parent render.
 */
const HEADING_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
} as const;

export type HeadlineTag = keyof typeof HEADING_TAGS;

const headingTags = HEADING_TAGS as Record<
  HeadlineTag,
  ComponentType<HTMLMotionProps<"h1">>
>;

export interface HeadlineSegment {
  text: string;
  /**
   * Fills this segment with the brand gradient. Keep it to one short phrase —
   * the gradient restarts per word, so a long accented run reads as stripes.
   */
  accent?: boolean;
}

export interface AnimatedHeadlineProps {
  segments: HeadlineSegment[];
  as?: HeadlineTag;
  /** Seconds before the first word moves, for staggering against other layers. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  className?: string;
}

export function AnimatedHeadline({
  segments,
  as = "h1",
  delay = 0,
  stagger = 0.055,
  className,
}: AnimatedHeadlineProps) {
  const Heading = headingTags[as];

  /* Built from the segment text, not from the split words, so the announced
     label keeps its authored spacing. */
  const label = segments
    .map((segment) => segment.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  /* Flattened up front: a word needs a key that stays unique across segments,
     and the accent flag has to survive the split. */
  const words = segments.flatMap((segment, segmentIndex) =>
    segment.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word, wordIndex) => ({
        word,
        accent: segment.accent === true,
        key: `${segmentIndex}-${wordIndex}-${word}`,
      })),
  );

  return (
    <Heading
      aria-label={label}
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      animate="visible"
    >
      {words.map(({ word, accent, key }, index) => (
        <Fragment key={key}>
          <motion.span
            aria-hidden
            variants={headlineWord}
            /* `inline-block` so the `y` transform applies — inline elements
               ignore vertical transforms. The plain space that follows keeps
               normal word wrapping. */
            className={cn("inline-block", accent && "text-gradient-brand")}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Heading>
  );
}
