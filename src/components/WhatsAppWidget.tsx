"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { FlagIcon, type FlagCode } from "@/components/ui/FlagIcon";
import { whatsappLinks } from "@/constants/site";
import { transitions } from "@/animations/variants";

/**
 * Floating WhatsApp launcher with a per-office chooser.
 *
 * Two offices answer two different numbers, so a single `wa.me` link would send
 * half the enquiries to the wrong timezone. The panel makes the choice explicit
 * and shows the number itself, which is also the honest thing to do before
 * handing someone off to another app.
 *
 * Everything it renders comes from `whatsappLinks`, which is derived from
 * `contact.phones` — the numbers are never written twice, and adding a third
 * office is a data edit with no change here.
 *
 * **Stacking.** `z-20` is deliberate and sits *below* the mobile nav sheet
 * (`z-30`) and the header (`z-40`). A launcher floating over an open
 * full-screen menu would be a bug; being painted under it is the correct
 * behaviour and needs no coordination between the two components.
 */

/* WhatsApp brand green. Not a theme token — it identifies the destination app,
   so it must not drift with a palette swap. White on it clears AA at this size. */
const WHATSAPP_GREEN = "#25D366";

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  /* Escape closes, and so does a click anywhere outside — the same two
     dismissals the mobile nav sheet offers, so the site behaves consistently. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      /* `pb-[env(safe-area-inset-bottom)]` keeps the launcher clear of the iOS
         home indicator, which otherwise overlaps the bottom of the button. */
      className="fixed right-4 bottom-4 z-20 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)] sm:right-6 sm:bottom-6"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={transitions.fast}
            /* `origin-bottom-right` so the panel grows out of the button rather
               than out of its own centre. */
            className="surface-glass w-[min(19rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-card shadow-[var(--shadow-card-hover)] backdrop-blur-[var(--glass-blur)] supports-[not(backdrop-filter:blur(0))]:bg-surface"
          >
            <div className="border-b border-border-subtle px-5 py-4">
              <p className="text-sm font-semibold text-foreground">
                Chat on WhatsApp
              </p>
              <p className="mt-1 text-xs text-subtle">
                Pick the office closest to you.
              </p>
            </div>

            <ul className="flex flex-col">
              {whatsappLinks.map((link) => (
                <li key={link.href} className="border-b border-border-subtle last:border-b-0">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3.5 px-5 py-4 transition-colors duration-200 hover:bg-surface-hover"
                  >
                    <FlagIcon code={link.country as FlagCode} size={26} />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {link.region} office
                      </span>
                      <span className="text-xs text-subtle tabular-nums">
                        {link.display}
                      </span>
                    </span>
                    <Icon
                      name="arrowUpRight"
                      size={16}
                      className="ml-auto text-subtle"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close WhatsApp options" : "Chat with us on WhatsApp"}
        style={{ backgroundColor: WHATSAPP_GREEN }}
        className={cn(
          "inline-flex h-14 w-14 items-center justify-center rounded-full text-white",
          "shadow-[0_10px_30px_-8px_rgb(37_211_102_/_0.55)]",
          "transition-transform duration-350 ease-out-expo active:scale-[0.94]",
          "hover:scale-105 focus-visible:scale-105",
        )}
      >
        <Icon name={open ? "close" : "whatsapp"} size={open ? 22 : 26} />
      </button>
    </div>
  );
}
