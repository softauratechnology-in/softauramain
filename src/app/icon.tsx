import { ImageResponse } from "next/og";
import { themePresets } from "@/styles/themes";

/**
 * The square app icon, for the web app manifest and for browsers that prefer a
 * PNG over the .ico.
 *
 * Same tile as `apple-icon`, at 512 so it survives being scaled down to every
 * size a launcher asks for. `favicon.ico` is left in place and still wins for
 * the browser tab.
 */

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

const sand = themePresets.sand;

export default function Icon() {
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
          fontSize: 260,
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
