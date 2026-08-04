/**
 * Colour system — single source of truth.
 *
 * These raw values are mirrored as CSS custom properties in `app/globals.css`
 * (`@theme inline`), which is what Tailwind utilities compile against. Import
 * from here only when a value is needed in JavaScript rather than CSS — e.g.
 * three.js materials and lights, canvas fills, or `<meta name="theme-color">`.
 *
 * Rule of thumb: styling a DOM node? Use the Tailwind token (`bg-surface`,
 * `text-brand`). Feeding a WebGL/JS API? Import from here.
 */

import { activeTheme } from "./themes";

/** Neutral ramp — the dark canvas the whole site sits on. */
export const neutral = {
  /** Page background. */
  950: "#07070b",
  /** Elevated panels, cards at rest. */
  900: "#0d0d14",
  /** Card hover, inset wells. */
  850: "#12121c",
  /** Borders, dividers. */
  800: "#1c1c28",
  /** Disabled surfaces. */
  700: "#2a2a3a",
  /** Muted body copy on dark. */
  400: "#8b8ba3",
  /** Secondary body copy. */
  300: "#b4b4c7",
  /** Primary body copy. */
  100: "#e8e8ef",
  /** Headings, highest-contrast text. */
  50: "#f7f7fb",
} as const;

/** Primary brand — indigo. Used for primary CTAs and active states. */
export const brand = {
  50: "#eef0ff",
  100: "#e0e3ff",
  200: "#c6cbff",
  300: "#a3a8ff",
  400: "#817fff",
  /** Brand base. Contrast ratio 4.9:1 on `neutral.950`. */
  500: "#6366f1",
  600: "#4f46e5",
  700: "#4338ca",
  800: "#3730a3",
  900: "#282366",
} as const;

/** Secondary brand — violet. Pairs with `brand` in gradients and glows. */
export const secondary = {
  300: "#d8b4fe",
  400: "#c084fc",
  500: "#a855f7",
  600: "#9333ea",
  700: "#7e22ce",
} as const;

/** Accent — cyan. Sparingly: highlights, metrics, hover underlines. */
export const accent = {
  300: "#67e8f9",
  400: "#22d3ee",
  500: "#06b6d4",
  600: "#0891b2",
} as const;

/** Feedback colours for form validation and status messaging. */
export const feedback = {
  success: "#34d399",
  successSurface: "#052e23",
  warning: "#fbbf24",
  error: "#fb7185",
  errorSurface: "#3f0d18",
} as const;

/**
 * Semantic aliases. Components should reference *these* names (or the matching
 * Tailwind token) rather than a raw ramp step, so a rebrand is a one-file edit.
 */
export const semantic = {
  /* The canvas layer comes from the active theme preset (`styles/themes.ts`),
     so JS consumers — three.js, `<meta name="theme-color">` — follow a preset
     swap without a second edit. */
  background: activeTheme.background,
  surface: activeTheme.surface,
  surfaceHover: activeTheme.surfaceHover,
  border: activeTheme.border,
  borderStrong: activeTheme.borderStrong,
  foreground: activeTheme.foreground,
  foregroundMuted: activeTheme.muted,
  foregroundSubtle: activeTheme.subtle,
  brand: brand[500],
  brandStrong: brand[600],
  brandContrast: neutral[50],
  secondary: secondary[500],
  accent: accent[400],
} as const;

/**
 * Gradients, as ready-to-use CSS values.
 * Keep every multi-stop gradient in the site here — ad-hoc gradients in JSX
 * are the fastest way to drift off-brand.
 */
export const gradients = {
  /** Headline text fill and primary button sheen. */
  brand: `linear-gradient(135deg, ${brand[500]} 0%, ${secondary[500]} 50%, ${accent[400]} 100%)`,
  /** Subtle top-lit card surface. */
  surface: `linear-gradient(180deg, ${activeTheme.surface} 0%, ${activeTheme.background} 100%)`,
  /** Radial bloom behind the hero and CTA sections. */
  glow: `radial-gradient(60% 60% at 50% 40%, ${brand[600]}33 0%, transparent 70%)`,
  /** Hairline that fades at both ends — section dividers. */
  hairline: `linear-gradient(90deg, transparent 0%, ${activeTheme.borderStrong} 50%, transparent 100%)`,
} as const;

/** Colours consumed by the WebGL hero scene (three.js needs plain hex). */
export const scene = {
  keyLight: brand[400],
  rimLight: accent[400],
  fillLight: secondary[500],
  material: activeTheme.surfaceHover,
  wireframe: brand[300],
} as const;

export const colors = {
  neutral,
  brand,
  secondary,
  accent,
  feedback,
  semantic,
  gradients,
  scene,
} as const;

export type ColorSystem = typeof colors;
