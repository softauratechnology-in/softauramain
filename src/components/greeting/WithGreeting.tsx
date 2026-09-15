"use client";

import type { ReactNode } from "react";
import { useGreeting } from "./GreetingProvider";
import type { GreetingKind } from "@/data/greetings";

/**
 * Fires a greeting when anything inside it is clicked.
 *
 * Exists so `Button`, `Footer` and `ContactSection` can stay Server Components.
 * Making the button itself client-side to attach one handler would pull it —
 * and the fifteen sections that render it — into the client bundle, which the
 * note at the top of `Button.tsx` is explicit about avoiding.
 *
 * So the client boundary is this wrapper instead: a `<span>` with one listener,
 * catching the click as it bubbles up from whatever server-rendered link or
 * button is inside. The child is untouched and unaware.
 *
 * `display: contents` keeps it out of the layout entirely — the span is a
 * listener, not a box, and it must not introduce a wrapper that changes how the
 * button sits in a flex row.
 */
export function WithGreeting({
  kind,
  name,
  children,
  className,
}: {
  kind: GreetingKind;
  /** Substituted into greetings that address the visitor. */
  name?: string;
  children: ReactNode;
  className?: string;
}) {
  const { greet } = useGreeting();

  return (
    <span
      /* `onClick`, not `onClickCapture`: the greeting should follow the action
         rather than race it, and a child that calls `stopPropagation` has a
         reason to. */
      onClick={() => greet(kind, name)}
      className={className ?? "contents"}
    >
      {children}
    </span>
  );
}
