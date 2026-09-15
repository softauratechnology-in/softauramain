import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Icon set.
 *
 * Hand-rolled rather than pulled from an icon package: the site needs ~18 icons,
 * and every tree-shakeable icon library still costs a dependency and a bundle
 * entry for something that compiles to a few hundred bytes of inline path data.
 * All glyphs share a 24×24 viewBox, 1.5 stroke width and `currentColor`, so they
 * inherit text colour and optical weight automatically.
 *
 * Adding an icon: add a path to `paths` and the name is available immediately —
 * `IconName` is derived from the map, so a typo is a type error.
 *
 * Most glyphs are a bare `d` string, drawn as an outline. A few — a rating star,
 * a brand mark — only read correctly as solid shapes, so an entry may instead be
 * `{ d, filled: true }`, which swaps `fill` and `stroke` for that one icon. The
 * two forms are otherwise identical to use.
 */

/** A stroked outline (the common case) or a solid shape. */
type Glyph = string | { readonly d: string; readonly filled: true };

const paths = {
  // — Service and category glyphs —
  layers:
    "M12 3 3 7.5 12 12l9-4.5L12 3ZM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5",
  browser:
    "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 3h18M6.5 7.5h.01M9 7.5h.01",
  device:
    "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2.5 15h3",
  palette:
    "M12 21a9 9 0 1 1 9-9c0 2.2-1.8 3-3.4 3H16a2 2 0 0 0-1.4 3.4c.4.5.4 1.3-.2 1.9-.6.5-1.5.7-2.4.7ZM8 8.5h.01M7 12.5h.01M11 6.5h.01M15 7.5h.01",
  cloud:
    "M7 18h10a3.5 3.5 0 0 0 .3-6.99A5.5 5.5 0 0 0 6.5 10.2 3.9 3.9 0 0 0 7 18Z",
  sparkle:
    "M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15.4l-1.6-4.6L6 9.2l4.4-1.6L12 3Zm6.5 9.5.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z",
  pipeline:
    "M5 7h5a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2h5M5 7a2 2 0 1 0-.001-.001M19 17a2 2 0 1 0 .001.001M17 7h2M8 17h2",
  shield: "M12 3l8 3v5.5c0 4.5-3.2 8.4-8 9.5-4.8-1.1-8-5-8-9.5V6l8-3Zm-3 9 2.2 2.2L15.5 10",
  server:
    "M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v3A1.5 1.5 0 0 1 18.5 10h-13A1.5 1.5 0 0 1 4 8.5v-3Zm0 10A1.5 1.5 0 0 1 5.5 14h13a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-3ZM7.5 7h.01M7.5 17h.01",
  database:
    "M12 3c4.4 0 8 1.1 8 2.5S16.4 8 12 8 4 6.9 4 5.5 7.6 3 12 3Zm8 2.5v13c0 1.4-3.6 2.5-8 2.5s-8-1.1-8-2.5v-13M20 12c0 1.4-3.6 2.5-8 2.5S4 13.4 4 12",
  cart: "M3 4.5h2.2l2.3 10.2a1.5 1.5 0 0 0 1.5 1.2h7.8a1.5 1.5 0 0 0 1.5-1.2L20 8H6.2M9.5 20a1 1 0 1 0 .01 0M17 20a1 1 0 1 0 .01 0",

  // — Differentiator glyphs —
  users:
    "M15.5 20v-1.5a3.5 3.5 0 0 0-3.5-3.5H7a3.5 3.5 0 0 0-3.5 3.5V20M9.5 11.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM20.5 20v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 5.2a3.25 3.25 0 0 1 0 6.1",
  code: "M9 18l-6-6 6-6M15 6l6 6-6 6",
  refresh:
    "M20 11.5A8 8 0 0 0 6.3 6.3L4 8.5M4 12.5a8 8 0 0 0 13.7 5.2L20 15.5M4 4v4.5h4.5M20 20v-4.5h-4.5",
  lifebuoy:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9",

  // — Process glyphs —
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm4.6-1.9L20 20",
  blueprint:
    "M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13ZM8 4v16M4 9h4M4 15h4M12 8h4M12 12h4",
  check: "M4.5 12.5 9.5 17.5 19.5 6.5",
  rocket:
    "M13.5 4.5c3 0 6 3 6 6 0 1.6-2.6 4.5-5 6.5l-4-4c2-2.4 4.9-5 6.5-5M9.5 13 7 10.5 4 12l2 2M11 15l2.5 2.5L12 20.5l-2-2M6 18l-1.5 1.5",

  // — UI glyphs —
  arrowRight: "M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5",
  arrowUpRight: "M7 17 17 7m0 0H9m8 0v8",
  plus: "M12 5v14M5 12h14",
  chevronDown: "M6 9.5l6 6 6-6",
  chevronLeft: "M14.5 6l-6 6 6 6",
  chevronRight: "M9.5 6l6 6-6 6",
  calendar:
    "M4.5 7.5A1.5 1.5 0 0 1 6 6h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 18 20H6a1.5 1.5 0 0 1-1.5-1.5v-11ZM8 4v4M16 4v4M4.5 11h15",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  quote:
    "M9.5 6C7 7.4 5.5 9.9 5.5 13v5h5v-6h-3c0-2 .8-3.6 2.4-4.6L9.5 6Zm9 0C16 7.4 14.5 9.9 14.5 13v5h5v-6h-3c0-2 .8-3.6 2.4-4.6L18.5 6Z",
  mail: "M3.5 7.5A1.5 1.5 0 0 1 5 6h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.5v-9Zm.7-.6 7.1 5.7a1 1 0 0 0 1.4 0l7.1-5.7",
  phone:
    "M8.4 4.5H5.8A1.8 1.8 0 0 0 4 6.4c0 6.9 5.6 12.5 12.5 12.5a1.8 1.8 0 0 0 1.8-1.8v-2.6l-3.6-1.2-1.8 1.8a12.7 12.7 0 0 1-4.6-4.6l1.8-1.8L8.4 4.5Z",
  pin: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  chart: "M3 20h18M6.5 20v-5.5M11.5 20V8.5M16.5 20v-8M21 20V5",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.5 9h17M3.5 15h17M12 3c2.4 2.4 3.7 5.5 3.7 9s-1.3 6.6-3.7 9c-2.4-2.4-3.7-5.5-3.7-9S9.6 5.4 12 3Z",

  // — Solid glyphs —
  /** Rating star. Outlined it reads as an empty rating, so it is always solid. */
  star: {
    d: "M12 2.4l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.42l-5.88 3.09 1.12-6.55L2.48 9.32l6.58-.96L12 2.4Z",
    filled: true,
  },
  /** WhatsApp brand mark. Subpaths in one `d`; must not be restyled. */
  whatsapp: {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z",
    filled: true,
  },
} as const satisfies Record<string, Glyph>;

export type IconName = keyof typeof paths;

/** Every available icon name — handy for building icon pickers or tests. */
export const iconNames = Object.keys(paths) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Rendered size in px, applied to both axes. */
  size?: number;
  /**
   * When provided, the icon is exposed to assistive technology with this label.
   * Omit it for decorative icons — they are then correctly hidden.
   */
  label?: string;
}

export function Icon({
  name,
  size = 24,
  label,
  className,
  ...props
}: IconProps) {
  const glyph: Glyph = paths[name];
  /* Solid glyphs invert the paint: `fill` carries the shape and there is no
     stroke, so a heavier `strokeWidth` never thickens them. */
  const filled = typeof glyph !== "string";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={filled ? undefined : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...props}
    >
      <path d={filled ? glyph.d : glyph} />
    </svg>
  );
}
