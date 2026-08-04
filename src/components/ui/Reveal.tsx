"use client";

import type { ComponentType, ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import {
  revealVariants,
  staggerContainer,
  viewportOnce,
  type RevealVariant,
} from "@/animations/variants";
import { motion as motionTokens } from "@/styles/theme";
import type { PolymorphicTag } from "@/lib/polymorphic";

/**
 * A `motion`-wrapped element, typed through `HTMLMotionProps<"div">`.
 *
 * The concrete tag varies, but every tag we allow accepts the same motion props
 * plus generic HTML attributes — so one prop type covers them all. Typing this as
 * a bare `ElementType` union instead would intersect the props of every member and
 * collapse to `never`, rejecting even `className`.
 */
type MotionTag = ComponentType<HTMLMotionProps<"div">>;

/**
 * All motion-wrapped tags, built once at module scope.
 *
 * Built eagerly rather than lazily on first use because component types must not
 * be created during render: `motion.create()` returns a *new* type each call, so a
 * render-time call would remount the subtree and discard its animation state on
 * every parent render. A static map means `motionTag()` is a plain lookup.
 */
const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  section: motion.section,
  article: motion.article,
  aside: motion.aside,
  figure: motion.figure,
  header: motion.header,
  footer: motion.footer,
  main: motion.main,
  nav: motion.nav,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
} as const satisfies Record<PolymorphicTag, unknown>;

/** Typed view of the map, so an index yields a renderable component type. */
const motionTags = MOTION_TAGS as Record<PolymorphicTag, MotionTag>;

/**
 * Scroll reveal.
 *
 * The single mechanism for "fade something in when it enters the viewport".
 * Wrapping content in `<Reveal>` costs one small client component; sections
 * themselves stay Server Components, so only the wrapper ships JS.
 *
 * `once: true` is not optional — re-triggering reveals on every scroll pass is
 * the most common cause of janky agency sites.
 */
export interface RevealProps {
  children: ReactNode;
  /** Which variant to animate with. Defaults to the house rise-and-fade. */
  variant?: RevealVariant;
  /** Seconds to wait before animating. Prefer `<RevealGroup>` over manual delays. */
  delay?: number;
  as?: PolymorphicTag;
  className?: string;
}

export function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  as = "div",
  className,
}: RevealProps) {
  const MotionTag = motionTags[as];

  return (
    <MotionTag
      className={className}
      variants={revealVariants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}

export interface RevealGroupProps {
  children: ReactNode;
  /** Seconds between each child. Defaults to the theme stagger. */
  stagger?: number;
  /** Seconds before the first child animates. */
  delay?: number;
  as?: PolymorphicTag;
  className?: string;
}

/**
 * Staggers direct `<RevealItem>` children.
 *
 * Use this for grids and lists instead of giving each card its own `delay` —
 * the parent owns the rhythm, so inserting or removing a card cannot desync it.
 *
 * @example
 * <RevealGroup className="grid gap-6 sm:grid-cols-2">
 *   {services.map((s) => <RevealItem key={s.id}><ServiceCard {...s} /></RevealItem>)}
 * </RevealGroup>
 */
export function RevealGroup({
  children,
  stagger = motionTokens.stagger,
  delay = 0,
  as = "div",
  className,
}: RevealGroupProps) {
  const MotionTag = motionTags[as];

  return (
    <MotionTag
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </MotionTag>
  );
}

export interface RevealItemProps {
  children: ReactNode;
  variant?: RevealVariant;
  as?: PolymorphicTag;
  className?: string;
}

/**
 * A child of `<RevealGroup>`. Carries no `initial`/`whileInView` of its own —
 * the parent's stagger drives it.
 */
export function RevealItem({
  children,
  variant = "fadeUp",
  as = "div",
  className,
}: RevealItemProps) {
  const MotionTag = motionTags[as];

  return (
    <MotionTag className={className} variants={revealVariants[variant]}>
      {children}
    </MotionTag>
  );
}
