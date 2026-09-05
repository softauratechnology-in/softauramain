"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Hero backdrop — the animated layer behind the headline.
 *
 * Replaces the WebGL hero this site used to run. The whole thing is three
 * blurred colour fields and a few frosted panels, which buys most of the depth
 * a 3D scene gave for none of the cost: no `three` in the bundle, no WebGL
 * context, no capability probe, and it renders identically on a four-year-old
 * Android and a workstation.
 *
 * Every animated property is `transform` or `opacity` — the two things the
 * compositor can run without touching layout or paint. Blur is applied once, to
 * elements that never animate their filter, because animating `filter: blur()`
 * forces a re-rasterise every frame and is the usual reason a "lightweight"
 * gradient hero drops frames.
 *
 * Reduced motion needs no branch here: `MotionProvider` sets
 * `reducedMotion="user"` globally, so Framer drops the transforms and keeps the
 * composition exactly as it renders on the first frame.
 */

/** Slow, offset drifts. Long durations — this should read as breathing, not motion. */
const blobs = [
  {
    className:
      "left-[-10%] top-[-15%] h-[38rem] w-[38rem] bg-[radial-gradient(circle_at_35%_30%,var(--brand-400)_0%,var(--brand-500)_35%,transparent_70%)]",
    opacity: 0.5,
    animate: { x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.06, 1] },
    duration: 22,
  },
  {
    className:
      "right-[-12%] top-[-8%] h-[34rem] w-[34rem] bg-[radial-gradient(circle_at_60%_40%,var(--secondary-400)_0%,var(--secondary-500)_40%,transparent_70%)]",
    opacity: 0.42,
    animate: { x: [0, -34, 0], y: [0, 44, 0], scale: [1, 1.09, 1] },
    duration: 27,
  },
  {
    className:
      "bottom-[-25%] left-[25%] h-[30rem] w-[30rem] bg-[radial-gradient(circle_at_50%_50%,var(--accent-300)_0%,var(--brand-300)_45%,transparent_72%)]",
    opacity: 0.32,
    animate: { x: [0, 30, 0], y: [0, -26, 0], scale: [1, 1.05, 1] },
    duration: 31,
  },
];

/** Frosted panels, right of the copy column. Depth cue, not content. */
const panels = [
  {
    className: "right-[6%] top-[22%] h-40 w-64 rotate-[-8deg]",
    animate: { y: [0, -18, 0], rotate: [-8, -5, -8] },
    duration: 12,
  },
  {
    className: "right-[22%] top-[46%] h-28 w-44 rotate-[6deg]",
    animate: { y: [0, 16, 0], rotate: [6, 9, 6] },
    duration: 15,
  },
  {
    className: "right-[3%] top-[58%] h-32 w-52 rotate-[3deg]",
    animate: { y: [0, -12, 0], rotate: [3, 0, 3] },
    duration: 18,
  },
];

export interface HeroBackdropProps {
  className?: string;
}

export function HeroBackdrop({ className }: HeroBackdropProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={cn("absolute rounded-full blur-3xl", blob.className)}
          style={{ opacity: blob.opacity }}
          animate={blob.animate}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Hidden below `lg`: on a phone these sit under the copy and only muddy
          the contrast behind it. */}
      {panels.map((panel, index) => (
        <motion.div
          key={index}
          className={cn(
            "surface-glass-subtle absolute hidden rounded-2xl backdrop-blur-[var(--glass-blur)] lg:block",
            panel.className,
          )}
          animate={panel.animate}
          transition={{
            duration: panel.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
