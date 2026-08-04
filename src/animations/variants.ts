import type { Transition, Variants } from "motion/react";
import { motion as motionTokens } from "@/styles/theme";

/**
 * Framer Motion variants shared across the site.
 *
 * Every reveal in the site should come from this file. Sections that invent
 * their own timings are the reason agency sites end up feeling uneven.
 *
 * Reduced motion is handled globally by `<MotionProvider>` (which sets Framer's
 * `reducedMotion: "user"`), so these variants do not each need to branch — the
 * transform is dropped and only opacity animates.
 */

const { duration, ease, stagger, revealDistance } = motionTokens;

export const transitions = {
  fast: { duration: duration.fast, ease: ease.outArray } satisfies Transition,
  base: { duration: duration.base, ease: ease.outArray } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.outArray } satisfies Transition,
  slower: { duration: duration.slower, ease: ease.outArray } satisfies Transition,
} as const;

/** Default reveal: rise and fade. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: revealDistance },
  visible: { opacity: 1, y: 0, transition: transitions.slow },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -revealDistance },
  visible: { opacity: 1, y: 0, transition: transitions.slow },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.slow },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -revealDistance * 1.5 },
  visible: { opacity: 1, x: 0, transition: transitions.slow },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: revealDistance * 1.5 },
  visible: { opacity: 1, x: 0, transition: transitions.slow },
};

/** For cards entering a grid — a touch of scale reads as "settling into place". */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: revealDistance / 2 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transitions.slow },
};

export const revealVariants = {
  fadeUp,
  fadeDown,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleIn,
} as const;

export type RevealVariant = keyof typeof revealVariants;

/**
 * Parent variant that staggers children. Pair with any of the above on the
 * children — the parent controls only timing, never transform.
 */
export function staggerContainer(
  staggerChildren: number = stagger,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}

/**
 * Word-by-word headline reveal. Splitting is the caller's job (see
 * `<AnimatedHeadline>`); this only supplies the per-word timing.
 */
export const headlineWord: Variants = {
  hidden: { opacity: 0, y: "0.4em" },
  visible: {
    opacity: 1,
    y: "0em",
    transition: { duration: duration.slower, ease: ease.outArray },
  },
};

/** Whole-page enter/exit, used by `<PageTransition>`. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
  exit: { opacity: 0, y: -8, transition: transitions.fast },
};

/**
 * Shared `whileInView` config. `once: true` matters for performance — without
 * it every section re-animates on each scroll pass.
 */
export const viewportOnce = { once: true, amount: 0.25 } as const;
