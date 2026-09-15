import { ImageResponse } from "next/og";
import { site, contact } from "@/constants/site";
import { themePresets } from "@/styles/themes";

/**
 * The site-wide link preview card.
 *
 * Generated rather than drawn. A hand-made PNG is a second copy of the brand
 * that silently goes stale the first time a colour or the tagline changes; this
 * reads the same `site` constants and theme tokens every page does, so it
 * cannot disagree with the site it previews.
 *
 * Next picks this up by file convention — `opengraph-image` in the app root
 * applies to every route that does not define its own, which is why no
 * `openGraph.images` entry is needed in `layout.tsx`. `/work/[slug]` keeps its
 * own case-study artwork and overrides this.
 *
 * Constraints worth knowing before editing: `ImageResponse` runs Satori, which
 * supports a deliberately small subset of CSS. Every element needs an explicit
 * `display`, flexbox is the only layout model, and there is no `gap` shorthand
 * inheritance — so the markup below is more explicit than normal JSX would be.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

/* Read straight from the theme presets rather than re-typing hexes: the OG card
   is the one surface a reader sees before the site itself, so it must not drift
   from the canvas they land on. */
const sand = themePresets.sand;
const BRAND = "#4f46e5";
const SECONDARY = "#9333ea";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: sand.background,
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Brand bloom, the same gesture as `.bg-brand-glow` on the hero. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background: `radial-gradient(circle at 50% 50%, ${BRAND}26 0%, ${SECONDARY}14 45%, ${sand.background}00 70%)`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 9999,
                background: BRAND,
                display: "flex",
              }}
            />
            <div
              style={{
                fontSize: 26,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: sand.subtle,
                display: "flex",
              }}
            >
              {contact.regions.join("  ·  ")}
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              fontSize: 82,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              color: sand.foreground,
              display: "flex",
              maxWidth: 940,
            }}
          >
            We build the software your business runs on
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: `1px solid ${sand.border}`,
            paddingTop: 34,
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              color: sand.foreground,
              display: "flex",
            }}
          >
            {site.name}
          </div>
          <div style={{ fontSize: 26, color: sand.muted, display: "flex" }}>
            {site.tagline}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
