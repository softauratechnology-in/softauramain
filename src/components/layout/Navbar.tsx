"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { primaryNav, primaryCta, routes } from "@/constants/navigation";
import { site } from "@/constants/site";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useScrolledPast } from "@/hooks/useScrollPosition";
import { transitions } from "@/animations/variants";

/**
 * Fixed navigation bar.
 *
 * Three behaviours:
 *  1. **Condense on scroll** — gains a frosted background and border once the
 *     page has moved, so it is transparent over the home hero and legible over
 *     content. Interior pages have no hero to sit over, so they start frosted.
 *  2. **Active route** — driven by `usePathname()`. `/work/school-erp` marks
 *     "Work" as current, which a strict equality check would miss.
 *  3. **Mobile sheet** — full-screen overlay, scroll-locked, closes on navigate
 *     and on `Escape`.
 */

/** Scroll distance, in px, before the bar takes on its solid treatment. */
const CONDENSE_AT = 24;

/** Current when the path *is* the route, or sits beneath it. */
function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useScrollLock(menuOpen);

  /* Condense-on-scroll — one shared rAF-coalesced listener, and a render only
     when the threshold is actually crossed. */
  const condensed = useScrolledPast(CONDENSE_AT);

  /* Only the home page opens with a full-bleed hero behind the bar. Everywhere
     else a transparent bar would float over body copy. */
  const overHero = pathname === routes.home;
  const solid = condensed || menuOpen || !overHero;

  /*
   * Close the sheet whenever the route changes.
   *
   * A route change can happen without a click on one of our own nav links —
   * browser back/forward, or a link inside the sheet's own content — so this
   * cannot live in an `onClick` alone.
   *
   * Adjusted during render rather than in an effect: React re-runs this
   * component immediately with the corrected state and never commits the stale
   * frame, so the sheet does not flash open on the new page. Doing it in an
   * effect would paint the wrong state first and cause a cascading render.
   */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  /* Escape closes the mobile sheet. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      {/* Keyboard users should not have to tab the whole nav to reach content. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-brand focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-350 ease-out-expo",
          solid
            /* Opaque on a phone, frosted from `lg` up. The bar sits directly
               over scrolling body copy on a narrow screen, where the desktop
               frost's ~0.81 alpha leaves it legible straight through. */
            ? "surface-glass-solid lg:surface-glass-strong border-x-0 border-t-0 backdrop-blur-[var(--glass-blur)] supports-[not(backdrop-filter:blur(0))]:bg-background"
            : "border-b border-transparent bg-transparent",
          /* The glass utilities set a border on all four sides and only three
             are zeroed above. With the sheet open the surviving bottom edge
             draws a hairline straight across the overlay, so drop it too. */
          solid && menuOpen && "border-b-0",
        )}
      >
        <Container className="flex h-[var(--nav-height)] items-center justify-between gap-6">
          <Link
            href={routes.home}
            aria-label={`${site.name} — home`}
            onClick={() => setMenuOpen(false)}
            className="text-foreground"
          >
            <Wordmark size="sm" />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const isActive = isCurrent(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                        isActive
                          ? "text-foreground"
                          : "text-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                      {isActive ? (
                        /* `layoutId` slides the pill between links instead of
                           cross-fading two of them. */
                        <motion.span
                          layoutId="nav-active-pill"
                          aria-hidden
                          className="absolute inset-0 -z-10 rounded-full bg-surface-hover"
                          transition={transitions.base}
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* The responsive display lives on this wrapper, not on the Button.
                `cn()` is a plain concatenator with no tailwind-merge, so a
                `hidden` passed as className would sit alongside the Button's own
                `inline-flex` rather than replacing it — and lose. Below `sm` the
                CTA is reached through the mobile sheet, which carries its own. */}
            <span className="hidden sm:block">
              <Button href={primaryCta.href} size="sm">
                {primaryCta.label}
              </Button>
            </span>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-foreground transition-colors duration-200 hover:border-border-strong lg:hidden"
            >
              <Icon name={menuOpen ? "close" : "menu"} size={20} />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.fast}
            /* Blur matches the header's `--glass-blur`. They previously differed
               (18px here vs 40px from `backdrop-blur-2xl`), which drew a visible
               seam along the bottom of the bar while the sheet was open.

               `overflow-y-auto` because the sheet is a fixed-height box: four
               items clear a 568px screen today, but a fifth would push the CTA
               off the bottom with no way to reach it. */
            className="fixed inset-0 z-30 overflow-y-auto overscroll-contain bg-background/97 pt-[var(--nav-height)] backdrop-blur-[var(--glass-blur)] lg:hidden"
          >
            <Container as="nav" aria-label="Mobile" className="py-8">
              <ul className="flex flex-col">
                {primaryNav.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...transitions.base, delay: 0.05 + index * 0.05 }}
                    className="border-b border-border-subtle"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-5 font-display text-2xl font-bold tracking-tight"
                    >
                      {item.label}
                      <Icon name="arrowRight" size={20} className="text-subtle" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <Button
                href={primaryCta.href}
                onClick={() => setMenuOpen(false)}
                fullWidth
                size="lg"
                icon="arrowRight"
                className="mt-8"
              >
                {primaryCta.label}
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
