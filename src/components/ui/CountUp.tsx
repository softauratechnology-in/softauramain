"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { cn } from "@/lib/cn";
import { useAllowsMotion } from "@/hooks/useMediaQuery";

export interface CountUpProps {
  /** The final figure. Also what renders on the server. */
  value: number;
  /** Appended verbatim after the number — "+", "%", nothing. */
  suffix?: string;
  /** Seconds for the full count. */
  duration?: number;
  className?: string;
}

/**
 * A figure that counts up to itself when it scrolls into view.
 *
 * **The final value is what renders on the server**, not a zero. That matters
 * more than the animation does: the number is then present for search engines,
 * for a reader with JavaScript disabled, and for anyone who never scrolls this
 * far. The count is decoration layered on top of a correct document, which is
 * the opposite of the usual implementation.
 *
 * The cost of that ordering is one painted frame showing the final value before
 * the count begins, for a tile that happens to be in view at first paint. The
 * `animate-count-in` fade on the tile covers it, and it is a far better trade
 * than shipping HTML that says "0".
 *
 * Frames are written straight to `textContent` rather than through state. React
 * never re-renders this span — its only inputs are props that do not change —
 * so there is no reconciliation to fight with, and a six-tile grid does not
 * schedule sixty renders a second between them.
 *
 * Reduced motion is checked explicitly. `MotionProvider`'s `reducedMotion`
 * setting governs Framer's own animations; an imperative `animate()` call is
 * not one of those, so the guard has to be here.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1.1,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const allowsMotion = useAllowsMotion();

  useEffect(() => {
    if (!inView || !allowsMotion) return;
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = `${Math.round(latest)}${suffix}`;
      },
      /* Land exactly on the target — the easing can finish a hair short. */
      onComplete: () => {
        node.textContent = `${value}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [inView, allowsMotion, value, suffix, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value}
      {suffix}
    </span>
  );
}
