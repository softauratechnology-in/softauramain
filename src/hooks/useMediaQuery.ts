"use client";

import { useCallback, useSyncExternalStore } from "react";
import { query } from "@/styles/theme";

/**
 * Subscribes to a CSS media query.
 *
 * Uses `useSyncExternalStore` rather than `useEffect` + `useState` so the value
 * is read during render on the client and never flashes a wrong frame. On the
 * server it returns `false` — always treat `false` as "assume the conservative
 * branch" (no cursor, no heavy 3D), so SSR output degrades gracefully.
 */
export function useMediaQuery(mediaQuery: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(mediaQuery);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [mediaQuery],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(mediaQuery).matches,
    [mediaQuery],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** True when the visitor has *not* asked for reduced motion. */
export function useAllowsMotion(): boolean {
  return useMediaQuery(query.allowsMotion);
}

/**
 * True when the visitor has a precise pointer and accepts motion — the gate for
 * the custom cursor and mouse-driven 3D parallax.
 */
export function usePointerInteractive(): boolean {
  return useMediaQuery(query.pointerInteractive);
}

/** True at the `lg` breakpoint and above. */
export function useIsDesktop(): boolean {
  return useMediaQuery(query.desktop);
}
