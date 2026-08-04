/**
 * Theme — everything that is not colour or type.
 *
 * Spacing, radii, shadows, z-index, breakpoints and motion timing live here so
 * that "how far apart do sections sit?" has exactly one answer.
 */

import { colors } from "./colors";
import { typography } from "./typography";

/**
 * Vertical rhythm. Sections use `section.y`; the page gutter is `page.x`.
 * Both are Tailwind class strings so they can be dropped straight into JSX.
 */
export const layout = {
  /** Horizontal page gutter, applied by `<Container>`. */
  pageX: "px-5 sm:px-8 lg:px-12",
  /** Max content width. `wide` is for full-bleed-ish grids. */
  maxWidth: "max-w-7xl",
  maxWidthWide: "max-w-[96rem]",
  maxWidthProse: "max-w-2xl",
  /** Standard section padding. Every section uses this unless it is full-bleed. */
  sectionY: "py-14 sm:py-18 lg:py-24",
  /** Tighter variant for sections that sit directly against a marquee. */
  sectionYTight: "py-10 sm:py-14",
  /** Gap between a section heading block and its content. */
  headingGap: "mb-10 sm:mb-12",
  /** Height of the fixed navbar — used for scroll-margin on anchor targets. */
  navHeight: "4.5rem",
} as const;

export const radius = {
  sm: "0.5rem",
  md: "0.875rem",
  /** Default for cards. */
  lg: "1.25rem",
  xl: "1.75rem",
  full: "9999px",
} as const;

export const shadow = {
  /** Resting card elevation — barely there, on dark it reads as depth. */
  card: "0 1px 2px 0 rgb(0 0 0 / 0.4)",
  /** Card hover. */
  cardHover: "0 20px 40px -12px rgb(0 0 0 / 0.6)",
  /** Brand glow under primary buttons. */
  brandGlow: `0 12px 32px -8px ${colors.brand[600]}66`,
  /** Dropdowns, mobile nav sheet. */
  overlay: "0 24px 64px -16px rgb(0 0 0 / 0.75)",
} as const;

/**
 * z-index scale. Named so nobody has to guess whether `z-50` is above the
 * cursor. Order: content < sticky < nav < overlay < cursor.
 */
export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 20,
  nav: 40,
  overlay: 60,
  /** The custom cursor must sit above everything, including the nav sheet. */
  cursor: 100,
} as const;

/** Matches Tailwind's default breakpoints — mirrored for JS media queries. */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Motion tokens. Shared by GSAP, Framer Motion and CSS transitions so that a
 * hover on a card and a hover on a button feel like the same website.
 */
export const motion = {
  duration: {
    /** Micro-interactions: button press, tag hover. */
    fast: 0.2,
    /** Default: hover states, colour fades. */
    base: 0.35,
    /** Reveals, accordion panels. */
    slow: 0.6,
    /** Page transitions, hero entrance. */
    slower: 0.9,
  },
  ease: {
    /** GSAP string / CSS cubic-bezier pair for the house "out" curve. */
    out: "power3.out",
    inOut: "power3.inOut",
    /** Framer Motion expects an array. */
    outArray: [0.16, 1, 0.3, 1] as const,
    inOutArray: [0.83, 0, 0.17, 1] as const,
    cssOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  /** Stagger between siblings in a revealed group. */
  stagger: 0.08,
  /** How far a revealing element travels, in px. */
  revealDistance: 28,
} as const;

/** Media query strings used by hooks and GSAP `matchMedia`. */
export const query = {
  reducedMotion: "(prefers-reduced-motion: reduce)",
  allowsMotion: "(prefers-reduced-motion: no-preference)",
  finePointer: "(pointer: fine)",
  /** Gate for the custom cursor and mouse-driven 3D parallax. */
  pointerInteractive:
    "(pointer: fine) and (prefers-reduced-motion: no-preference)",
  desktop: `(min-width: ${breakpoints.lg}px)`,
} as const;

export const theme = {
  colors,
  typography,
  layout,
  radius,
  shadow,
  zIndex,
  breakpoints,
  motion,
  query,
} as const;

export type Theme = typeof theme;
