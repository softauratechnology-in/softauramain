"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { greetings, greetingText, type GreetingKind } from "@/data/greetings";

/**
 * Greeting overlay and its trigger.
 *
 * One provider near the root holds the active greeting; anything below it calls
 * `useGreeting().greet(kind)` to show one. Centralised rather than per-button
 * because two greetings on screen at once reads as a bug, and a single owner
 * makes that impossible — a second call replaces the first.
 *
 * Reduced motion is already handled globally by `MotionConfig reducedMotion="user"`
 * in `MotionProvider`, which clamps transform and opacity animations for a
 * visitor who has asked for less motion. The greeting still appears and is
 * still announced; only the movement goes. That is the correct split: the text
 * is information, the animation is decoration.
 */

interface GreetingContextValue {
  greet: (kind: GreetingKind, name?: string) => void;
}

const GreetingContext = createContext<GreetingContextValue | null>(null);

/**
 * Returns a no-op outside the provider rather than throwing.
 *
 * A missing greeting is a missing flourish; a thrown error from a click handler
 * would take down the page around it. The action the greeting accompanies —
 * opening WhatsApp, sending the form — must never depend on this working.
 */
export function useGreeting(): GreetingContextValue {
  return useContext(GreetingContext) ?? { greet: () => {} };
}

/**
 * One motion per kind, so each action is recognisably its own.
 *
 * Deliberately distinct in *character*, not just in timing: the WhatsApp bubble
 * lifts and drifts the way a sent message does, the phone ring pulses outward,
 * the envelope unfolds, the assistant waves, and the enquiry check settles into
 * place. Someone who uses two of them should not feel they saw the same
 * animation twice.
 */
const iconMotion: Record<GreetingKind, Variants> = {
  whatsapp: {
    hidden: { opacity: 0, y: 14, scale: 0.7 },
    shown: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 18 } },
  },
  phone: {
    hidden: { opacity: 0, scale: 0.6, rotate: -18 },
    shown: {
      opacity: 1,
      scale: [0.6, 1.14, 1],
      rotate: [-18, 12, -6, 0],
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
  email: {
    hidden: { opacity: 0, scaleY: 0.2, y: -8 },
    shown: {
      opacity: 1,
      scaleY: 1,
      y: 0,
      transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
    },
  },
  chat: {
    hidden: { opacity: 0, scale: 0.5, rotate: -25 },
    shown: {
      opacity: 1,
      scale: 1,
      rotate: [-25, 18, -10, 0],
      transition: { duration: 0.7, ease: "easeOut" },
    },
  },
  enquiry: {
    hidden: { opacity: 0, scale: 0.4 },
    shown: {
      opacity: 1,
      scale: [0.4, 1.2, 1],
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  },
};

interface Active {
  kind: GreetingKind;
  text: string;
  /** Changes on every call, so repeating the same action replays the motion. */
  token: number;
}

export function GreetingProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Active | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tokenRef = useRef(0);

  const greet = useCallback((kind: GreetingKind, name?: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    tokenRef.current += 1;
    setActive({ kind, text: greetingText(kind, name), token: tokenRef.current });

    timerRef.current = setTimeout(() => {
      setActive(null);
      timerRef.current = null;
    }, greetings[kind].durationMs);
  }, []);

  /* A pending timer holding a reference into an unmounted tree is a leak, and
     on a route change this component can go before it fires. */
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const value = useMemo(() => ({ greet }), [greet]);

  return (
    <GreetingContext.Provider value={value}>
      {children}

      {/* `z-50` — above the header (`z-40`), because this is a transient
          confirmation of something the visitor just did and being obscured by
          the navbar would defeat it. `pointer-events-none` so it can never
          intercept a click on whatever is underneath. */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.token}
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 rounded-full border border-border-subtle bg-surface px-4 py-3 shadow-[0_18px_44px_-14px_rgb(0_0_0/0.3)]"
            >
              <motion.span
                variants={iconMotion[active.kind]}
                initial="hidden"
                animate="shown"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/12 text-brand-strong"
              >
                <Icon name={greetings[active.kind].icon} size={16} />
              </motion.span>
              <p className="text-sm font-medium text-pretty text-foreground">
                {active.text}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </GreetingContext.Provider>
  );
}
