"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Press feedback for `Button`.
 *
 * A deliberately tiny client island. `Button` itself stays a **server
 * component** — this mounts *inside* it and reaches one level up through
 * `parentElement` to listen for the press, so the button, `Icon` and every
 * section that renders one stay out of the client bundle.
 *
 * Two modes, because the two button variants have different constraints:
 *
 *  - `ripple` — a circle grown from the pointer, painted in `currentColor`. Used
 *    on `primary`, where the label is always white on a saturated fill.
 *  - `sweep` — a translucent band travelling left to right, plus an expanding
 *    ring on the border. Used on `secondary`, which is a *ghost* button: its
 *    fill and label colour are locked together for contrast (see the variant
 *    note in `Button.tsx`), so its press effect has to be purely additive.
 *    Anything that repainted the fill would strand the label mid-transition on
 *    a background it cannot be read against — on touch especially, where there
 *    is no hover state to have flipped it to white first.
 *
 * Reduced motion needs no branch here: the global rule in `globals.css` clamps
 * every animation to 0.01ms, so a press resolves instantly and cleans itself up
 * through the same `animationend` path.
 */

export type PressMode = "ripple" | "sweep";

interface Press {
  id: number;
  /** Offsets within the host box, in px. */
  x: number;
  y: number;
  /** Diameter that reaches the furthest corner from the press point. */
  size: number;
}

/** A fast tapper should not be able to grow the list without bound. */
const MAX_CONCURRENT = 4;

export function Ripple({ mode = "ripple" }: { mode?: PressMode }) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const nextId = useRef(0);
  const [presses, setPresses] = useState<Press[]>([]);

  useEffect(() => {
    /* The host is the first child of the button, so its parent *is* the button.
       Listening there rather than on the host itself is what keeps this
       pointer-transparent — the host must never intercept a click. */
    const target = hostRef.current?.parentElement;
    if (!target) return;

    const onPointerDown = (event: PointerEvent) => {
      /* Secondary pointer in a multi-touch gesture, or a right/middle click. */
      if (!event.isPrimary || event.button !== 0) return;

      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      /* Reach the furthest corner, so the circle always covers the button
         however far off-centre the press landed. */
      const size =
        2 *
        Math.max(
          Math.hypot(x, y),
          Math.hypot(rect.width - x, y),
          Math.hypot(x, rect.height - y),
          Math.hypot(rect.width - x, rect.height - y),
        );

      setPresses((current) => [
        ...current.slice(-(MAX_CONCURRENT - 1)),
        { id: nextId.current++, x, y, size },
      ]);
    };

    target.addEventListener("pointerdown", onPointerDown);
    return () => target.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const clear = (id: number) =>
    setPresses((current) => current.filter((press) => press.id !== id));

  return (
    <span
      ref={hostRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      {presses.map((press) =>
        mode === "ripple" ? (
          <span
            key={press.id}
            onAnimationEnd={() => clear(press.id)}
            className="absolute animate-ripple rounded-full bg-current"
            style={{
              left: press.x - press.size / 2,
              top: press.y - press.size / 2,
              width: press.size,
              height: press.size,
            }}
          />
        ) : (
          <span key={press.id}>
            {/* Directional band. Translucent `currentColor`, so it reads on the
                ghost rest state and on the filled hover state alike.

                The cleanup handler hangs off this one rather than the wrapper:
                `animationend` bubbles, so a handler on the parent would be
                fired by whichever of the two children finished first and would
                cut the other one short. Siblings do not bubble to each other. */}
            <span
              onAnimationEnd={() => clear(press.id)}
              className={cn(
                "absolute inset-y-0 -left-full w-full animate-press-sweep",
                "bg-gradient-to-r from-transparent via-current to-transparent",
              )}
            />
            {/* Expanding ring on the border — the second half of the effect. */}
            <span className="absolute inset-0 animate-press-glow rounded-[inherit]" />
          </span>
        ),
      )}
    </span>
  );
}
