"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { useAllowsMotion } from "@/hooks/useMediaQuery";

/**
 * Hero backdrop — the animated layer behind the headline.
 *
 * Replaces the WebGL hero this site used to run. The whole thing is three
 * blurred colour fields, a drifting rule grid and a few frosted panels, which
 * buys most of the depth a 3D scene gave for none of the cost: no `three` in the
 * bundle, no WebGL context, no capability probe, and it renders identically on a
 * four-year-old Android and a workstation.
 *
 * Every animated property is `transform` or `opacity` — the two things the
 * compositor can run without touching layout or paint. Blur is applied once, to
 * elements that never animate their filter, because animating `filter: blur()`
 * forces a re-rasterise every frame and is the usual reason a "lightweight"
 * gradient hero drops frames.
 *
 * **Why there is more here than blobs.** A `blur-3xl` field 608px across,
 * drifting 40px over 22 seconds, moves at under 2px/sec and has no edge to track
 * it by. On a desktop the frosted panels beside it give the eye a hard boundary
 * and the drift reads. On a 390px phone that field covers 156% of the viewport,
 * the panels are hidden, and the result is a still image. So the phone gets two
 * things the blobs cannot provide on their own: a grid whose 1px rules are an
 * unambiguous reference frame, and scroll-linked parallax, which is tied to the
 * reader's own finger and is by far the most legible motion on a small screen.
 *
 * Reduced motion: the looping animations are handled globally — `MotionProvider`
 * sets `reducedMotion="user"`, so Framer drops those transforms by itself. The
 * scroll parallax is **not** an animation in that sense (it is a value bound to
 * scroll position), so it is gated explicitly on `useAllowsMotion()`.
 */

/** Slow, offset drifts. Long durations — this should read as breathing, not motion. */
const blobs = [
  {
    className:
      "left-[-10%] top-[-15%] h-[22rem] w-[22rem] sm:h-[30rem] sm:w-[30rem] lg:h-[38rem] lg:w-[38rem] bg-[radial-gradient(circle_at_35%_30%,var(--brand-400)_0%,var(--brand-500)_35%,transparent_70%)]",
    opacity: 0.5,
    animate: { x: [0, 40, 0], scale: [1, 1.06, 1] },
    duration: 22,
  },
  {
    className:
      "right-[-12%] top-[-8%] h-[20rem] w-[20rem] sm:h-[27rem] sm:w-[27rem] lg:h-[34rem] lg:w-[34rem] bg-[radial-gradient(circle_at_60%_40%,var(--secondary-400)_0%,var(--secondary-500)_40%,transparent_70%)]",
    opacity: 0.42,
    animate: { x: [0, -34, 0], scale: [1, 1.09, 1] },
    duration: 27,
  },
  {
    className:
      "bottom-[-25%] left-[25%] h-[18rem] w-[18rem] sm:h-[24rem] sm:w-[24rem] lg:h-[30rem] lg:w-[30rem] bg-[radial-gradient(circle_at_50%_50%,var(--accent-300)_0%,var(--brand-300)_45%,transparent_72%)]",
    opacity: 0.32,
    animate: { x: [0, 30, 0], scale: [1, 1.05, 1] },
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
  const ref = useRef<HTMLDivElement>(null);
  const allowsMotion = useAllowsMotion();

  /* Progress across the hero's own exit, not the whole document. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Three rates, so the layers separate as the page moves. Declared
     individually rather than inside the `map` below — a hook in a loop is a
     rules-of-hooks violation even when the array length is a constant. */
  const driftNear = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const driftMid = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const driftFar = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const drifts = [driftMid, driftNear, driftFar];

  /* The grid travels against the blobs, which is what makes the separation read
     rather than looking like the whole backdrop sliding. */
  const gridDrift = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Rule grid. The mask lives on the wrapper and the lines translate
          inside it, so the fade stays put while the grid moves. One cell of
          travel loops seamlessly; the overscan hides the wrap at the edges. */}
      <motion.div
        style={{ y: allowsMotion ? gridDrift : 0 }}
        className="absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000_0%,transparent_100%)]"
      >
        <motion.div
          className="bg-grid-lines absolute -inset-16"
          animate={{ x: [0, 64], y: [0, 64] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          style={{ y: allowsMotion ? drifts[index] : 0 }}
          className="absolute inset-0"
        >
          <motion.div
            className={cn("absolute rounded-full blur-3xl", blob.className)}
            style={{ opacity: blob.opacity }}
            animate={blob.animate}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* Hidden below `lg`: on a phone these sit under the copy and only muddy
          the contrast behind it. The grid and the parallax above carry the
          mobile case instead — neither of them sits between text and canvas. */}
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
