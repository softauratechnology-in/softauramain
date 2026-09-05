/**
 * Theme presets — the page's canvas colours.
 *
 * Only the *neutral* layer varies between presets: background, surfaces,
 * borders and text. Brand / secondary / accent stay constant so the identity
 * survives a canvas swap.
 *
 * Switching the whole site is a one-line edit: change `ACTIVE_THEME` below.
 * The matching CSS lives in `app/globals.css` as `[data-theme="…"]` blocks —
 * one small block per preset, no runtime cost, no flash: the attribute is
 * server-rendered on `<html>` by `app/layout.tsx`.
 *
 * Per-section override (any preset, any subtree):
 *
 *   <section data-theme="slate"> … </section>
 *
 * Everything inside inherits that preset's variables — `bg-background`,
 * `bg-surface`, `text-muted` and friends all follow automatically.
 */

/** The neutral layer a preset has to supply. Mirrors the CSS var names. */
export type ThemeTokens = {
  /** Page canvas. */
  background: string;
  /** Cards and panels at rest. */
  surface: string;
  /** Card hover / inset wells. */
  surfaceHover: string;
  /** Hairlines and dividers. */
  border: string;
  /** Stronger borders, disabled surfaces. */
  borderStrong: string;
  /** Headings, highest-contrast text. */
  foreground: string;
  /** Secondary body copy. */
  muted: string;
  /** Tertiary copy, labels. */
  subtle: string;
};

export const themePresets = {
  /** Deep blue-black. Default — reads as "night", not "off". */
  midnight: {
    background: "#080b18",
    surface: "#0e1326",
    surfaceHover: "#141a33",
    border: "#1e2541",
    borderStrong: "#2c355a",
    foreground: "#f2f4fb",
    muted: "#b6bcd4",
    subtle: "#8891ad",
  },
  /** Near-black neutral. The original palette. */
  ink: {
    background: "#07070b",
    surface: "#0d0d14",
    surfaceHover: "#12121c",
    border: "#1c1c28",
    borderStrong: "#2a2a3a",
    foreground: "#f7f7fb",
    muted: "#b4b4c7",
    subtle: "#8b8ba3",
  },
  /** Cool grey — lighter dark, softer on large bright displays. */
  slate: {
    background: "#12151c",
    surface: "#1a1f29",
    surfaceHover: "#212734",
    border: "#2b323f",
    borderStrong: "#3b4453",
    foreground: "#f4f6f9",
    muted: "#bcc3ce",
    subtle: "#8e97a5",
  },
  /** Warm charcoal with a violet cast — pairs closely with the brand indigo. */
  plum: {
    background: "#100b18",
    surface: "#181025",
    surfaceHover: "#1f1630",
    border: "#2b1f42",
    borderStrong: "#3c2c5c",
    foreground: "#f6f2fb",
    muted: "#c2b7d4",
    subtle: "#968aad",
  },
  /**
   * Light preset — deliberately an off-white sand, never `#fff`. Kept so a
   * future light mode is a preset rather than a rewrite.
   */
  sand: {
    background: "#f2efe9",
    surface: "#faf8f4",
    surfaceHover: "#efebe2",
    border: "#ded8cc",
    borderStrong: "#c5bdad",
    foreground: "#171420",
    muted: "#4a4557",
    subtle: "#6d6779",
  },
} as const satisfies Record<string, ThemeTokens>;

export type ThemeName = keyof typeof themePresets;

/** The site-wide default. Change this one value to re-skin the whole site. */
export const ACTIVE_THEME: ThemeName = "sand";

export const activeTheme: ThemeTokens = themePresets[ACTIVE_THEME];

/** Whether a preset's canvas is light — for `<meta name="color-scheme">`. */
export const isLightTheme = (name: ThemeName): boolean => name === "sand";
