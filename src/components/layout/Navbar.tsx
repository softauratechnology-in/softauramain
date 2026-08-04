"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { primaryNav, primaryCta, SECTION_IDS } from "@/constants/navigation";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useScrolledPast } from "@/hooks/useScrollPosition";
import { transitions } from "@/animations/variants";

/**
 * Fixed navigation bar.
 *
 * Three behaviours:
 *  1. **Condense on scroll** — gains a background and border once the page has
 *     moved, so it is transparent over the hero and legible over content.
 *  2. **Active section** — the link matching the section currently in view is
 *     highlighted, driven by `IntersectionObserver` rather than scroll maths.
 *  3. **Mobile sheet** — full-screen overlay, scroll-locked, closes on navigate
 *     and on `Escape`.
 */

/** Scroll distance, in px, before the bar takes on its solid treatment. */
const CONDENSE_AT = 24;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(SECTION_IDS.hero);

  useScrollLock(menuOpen);

  /* Condense-on-scroll — one shared rAF-coalesced listener, and a render only
     when the threshold is actually crossed. */
  const condensed = useScrolledPast(CONDENSE_AT);

  /* Active-section tracking. One observer over all nav targets. */
  useEffect(() => {
    const ids = primaryNav.map((item) => item.href.replace("#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        /* Several sections can intersect at once; pick the one closest to the
           top of the viewport, which is what a reader perceives as "current". */
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (visible) setActiveSection(visible.target.id);
      },
      /* The band is the middle of the viewport, so a section becomes "active"
         when it dominates the screen rather than when its edge appears. */
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
          condensed || menuOpen
            ? "border-b border-border-subtle bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-[var(--nav-height)] items-center justify-between gap-6">
          <Link
            href={`#${SECTION_IDS.hero}`}
            data-cursor="hover"
            onClick={() => setMenuOpen(false)}
            className="text-foreground"
          >
            <Wordmark size="sm" />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-cursor="hover"
                      aria-current={isActive ? "true" : undefined}
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
            <Button href={primaryCta.href} size="sm" className="hidden sm:inline-flex">
              {primaryCta.label}
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              data-cursor="hover"
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
            className="fixed inset-0 z-30 bg-background/97 pt-[var(--nav-height)] backdrop-blur-2xl lg:hidden"
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
