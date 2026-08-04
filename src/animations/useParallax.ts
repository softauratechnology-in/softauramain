"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { query } from "@/styles/theme";

interface ParallaxOptions {
  /** Total travel in px across the element's scroll pass. Negative moves up. */
  distance?: number;
  /** Scrub smoothing in seconds. Higher = laggier, more luxurious. */
  smoothing?: number;
}

/**
 * Scroll-linked vertical parallax.
 *
 * Animates `yPercent` rather than `y` so the effect scales with the element and
 * stays composited on the GPU. Gated behind `prefers-reduced-motion` via GSAP
 * `matchMedia`, which also handles cleanup when the preference changes.
 *
 * @example
 * const ref = useParallax<HTMLDivElement>({ distance: -60 });
 * return <div ref={ref}>…</div>;
 */
export function useParallax<T extends HTMLElement>({
  distance = -80,
  smoothing = 0.6,
}: ParallaxOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const mm = gsap.matchMedia();

      mm.add(query.allowsMotion, () => {
        const tween = gsap.fromTo(
          element,
          { y: 0 },
          {
            y: distance,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: smoothing,
            },
          },
        );
        return () => tween.scrollTrigger?.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [distance, smoothing] },
  );

  return ref;
}
