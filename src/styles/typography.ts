/**
 * Typography system.
 *
 * Two families, loaded via `next/font` in the root layout:
 *  - `--font-syne`  → display / headings (geometric, high personality)
 *  - `--font-geist` → UI and body copy (neutral, excellent at small sizes)
 *
 * The `text` map below holds ready-to-spread Tailwind class strings. Sections
 * and cards compose these instead of hand-picking `text-*` on every heading,
 * which is what keeps the vertical rhythm consistent across the site.
 */

export const fontFamily = {
  display: "var(--font-syne)",
  sans: "var(--font-geist-sans)",
} as const;

/** Weight scale. Syne is loaded at 600/700/800 only — do not request others. */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/**
 * Fluid type scale. Each step is `clamp(min, preferred, max)` so headings scale
 * with the viewport without a cascade of breakpoint overrides.
 */
export const fontSize = {
  /** Hero headline. */
  display: "clamp(2.25rem, 7vw, 6rem)",
  /** Section headings. */
  h2: "clamp(1.75rem, 4.5vw, 3.75rem)",
  /** Card titles, sub-section headings. */
  h3: "clamp(1.375rem, 2vw, 1.875rem)",
  h4: "clamp(1.125rem, 1.4vw, 1.375rem)",
  /** Lead paragraph under a heading. */
  lead: "clamp(1.0625rem, 1.4vw, 1.25rem)",
  body: "1rem",
  small: "0.875rem",
  /** Eyebrow labels and tags. */
  micro: "0.75rem",
} as const;

export const lineHeight = {
  /** Display type — tight enough that multi-line headlines read as a block. */
  none: "0.95",
  tight: "1.1",
  snug: "1.25",
  normal: "1.5",
  relaxed: "1.7",
} as const;

export const letterSpacing = {
  /** Large display type needs negative tracking to avoid looking loose. */
  tighter: "-0.03em",
  tight: "-0.02em",
  normal: "0em",
  /** Eyebrow / uppercase labels. */
  wide: "0.08em",
  wider: "0.16em",
} as const;

/**
 * Composed presets. These are the API most components should use.
 *
 * @example
 * <h2 className={text.h2}>Services</h2>
 */
export const text = {
  display:
    "font-display text-[length:var(--text-display)] font-extrabold leading-none tracking-tighter",
  h2: "font-display text-[length:var(--text-h2)] font-bold leading-tight tracking-tight",
  h3: "font-display text-[length:var(--text-h3)] font-bold leading-snug tracking-tight",
  h4: "font-display text-[length:var(--text-h4)] font-semibold leading-snug tracking-tight",
  lead: "text-[length:var(--text-lead)] leading-relaxed text-muted",
  body: "text-base leading-relaxed text-muted",
  small: "text-sm leading-normal text-subtle",
  /** Uppercase eyebrow above a section heading. */
  eyebrow:
    "text-xs font-medium uppercase leading-none tracking-[0.16em] text-subtle",
  /** Numeric label, e.g. process step "03". */
  ordinal: "font-display text-sm font-semibold tabular-nums tracking-wide",
} as const;

/**
 * Neutral-grotesk headline variant (Helvetica/Inter-style): same fluid sizes as
 * `text.*`, but rendered in the UI family with heavier weight, tighter leading
 * and stronger negative tracking. Use when a headline should read as plain and
 * editorial rather than carrying Syne's personality.
 *
 * @example
 * <h1 className={cn(grotesk.display, "text-center")}>Digital design &amp; development agency</h1>
 */
export const grotesk = {
  display:
    "font-sans text-[length:var(--text-display)] font-bold leading-[1.02] tracking-[-0.035em]",
  h2: "font-sans text-[length:var(--text-h2)] font-bold leading-[1.06] tracking-[-0.03em]",
  h3: "font-sans text-[length:var(--text-h3)] font-semibold leading-tight tracking-[-0.02em]",
  h4: "font-sans text-[length:var(--text-h4)] font-semibold leading-snug tracking-[-0.015em]",
  /** Sub-headline paragraph that sits under a grotesk display line. */
  lead: "font-sans text-[length:var(--text-lead)] font-medium leading-snug tracking-[-0.01em] text-muted",
} as const;

export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  text,
  grotesk,
} as const;

export type Typography = typeof typography;
