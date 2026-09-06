import { cn } from "@/lib/cn";

/**
 * Small country flags, drawn inline.
 *
 * Not emoji. Regional-indicator pairs (🇮🇳, 🇦🇪) have no glyph in the fonts
 * Windows ships, so on the majority desktop platform they render as the bare
 * letters "IN" and "AE" — which is worse than no flag at all next to a phone
 * number. These are a handful of rectangles and cost less than the font
 * fallback would.
 *
 * Decorative by default: the region is always named in adjacent text, so the
 * flag is `aria-hidden` unless a `label` is passed.
 */

export type FlagCode = "IN" | "AE";

export interface FlagIconProps {
  code: FlagCode;
  /** Rendered width in px. Height follows the 3:2 ratio. */
  size?: number;
  /** Exposes the flag to assistive tech. Omit when the region is named nearby. */
  label?: string;
  className?: string;
}

export function FlagIcon({ code, size = 20, label, className }: FlagIconProps) {
  const clipId = `flag-clip-${code}`;

  return (
    <svg
      width={size}
      height={(size * 2) / 3}
      viewBox="0 0 24 16"
      className={cn("shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="16" rx="2.5" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {code === "IN" ? (
          <>
            <rect width="24" height="5.334" fill="#FF9933" />
            <rect y="5.334" width="24" height="5.333" fill="#FFFFFF" />
            <rect y="10.667" width="24" height="5.333" fill="#138808" />
            {/* Ashoka Chakra, simplified to its rim at this size. */}
            <circle
              cx="12"
              cy="8"
              r="1.9"
              fill="none"
              stroke="#000080"
              strokeWidth="0.7"
            />
          </>
        ) : (
          <>
            <rect x="6" width="18" height="5.334" fill="#00732F" />
            <rect x="6" y="5.334" width="18" height="5.333" fill="#FFFFFF" />
            <rect x="6" y="10.667" width="18" height="5.333" fill="#000000" />
            <rect width="6" height="16" fill="#EF3340" />
          </>
        )}
      </g>

      {/* Hairline, so a white band never dissolves into a light card. */}
      <rect
        width="24"
        height="16"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.15"
      />
    </svg>
  );
}
