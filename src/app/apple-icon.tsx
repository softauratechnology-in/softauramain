import { ImageResponse } from "next/og";
import { themePresets } from "@/styles/themes";

/**
 * iOS home-screen icon.
 *
 * Without this, adding the site to an iPhone home screen produces a screenshot
 * of the page rather than an icon — the one favicon the site had (`favicon.ico`)
 * covers the browser tab and nothing else.
 *
 * Drawn rather than cropped from `public/logo-mark.png`: that file is 537×639,
 * and iOS masks a non-square icon into a rounded square by stretching it. It
 * also composites on an opaque tile, so a transparent PNG picks up whatever is
 * behind it. A generated tile controls both.
 *
 * Next wires the `<link rel="apple-touch-icon">` by file convention; there is
 * no metadata entry to add.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const sand = themePresets.sand;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          /* Opaque, because iOS has no notion of a transparent app icon. */
          background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
          color: sand.surface,
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: "-0.06em",
        }}
      >
        SA
      </div>
    ),
    size,
  );
}
