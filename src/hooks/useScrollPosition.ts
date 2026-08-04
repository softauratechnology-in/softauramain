"use client";

import { useEffect, useState } from "react";

/**
 * Shared, rAF-coalesced window scroll listeners.
 *
 * Native scrolling fires `scroll` far more often than a frame can paint, so every
 * component that watches it needs the same three things: a `passive` listener (so
 * the browser can keep scrolling off the main thread), one read per frame instead
 * of one per event, and a render only when the value a component actually cares
 * about changes. Rather than re-implement that per component, both hooks below
 * share one subscription helper.
 */

/** Subscribe to scroll, reading `window.scrollY` at most once per frame. */
function onScrollFrame(read: (scrollY: number) => void): () => void {
  let frame = 0;

  const handle = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      read(window.scrollY);
    });
  };

  read(window.scrollY);
  window.addEventListener("scroll", handle, { passive: true });
  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener("scroll", handle);
  };
}

/**
 * `true` once the page has scrolled past `threshold` px.
 *
 * Renders only on the crossing, not on every frame — the common case for
 * condensing headers, back-to-top buttons and scroll-triggered chrome.
 *
 * @example
 * const condensed = useScrolledPast(24);
 */
export function useScrolledPast(threshold = 0): boolean {
  const [passed, setPassed] = useState(false);

  useEffect(
    () => onScrollFrame((scrollY) => setPassed(scrollY > threshold)),
    [threshold],
  );

  return passed;
}

/**
 * Current scroll offset in px, updated at most once per frame.
 *
 * This one *does* render every frame while scrolling, so reach for
 * `useScrolledPast` when a boolean will do, and for a GSAP ScrollTrigger when the
 * value only drives style (that stays off React's render path entirely).
 */
export function useScrollY(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => onScrollFrame(setScrollY), []);

  return scrollY;
}
