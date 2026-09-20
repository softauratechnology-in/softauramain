import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { themePresets } from "@/styles/themes";

/**
 * iOS home-screen icon — served at `/apple-icon`.
 *
 * Without this, adding the site to an iPhone home screen produces a screenshot
 * of the page rather than an icon.
 *
 * Two things differ from `/icon`, and both are iOS constraints rather than
 * preferences:
 *
 *  - **Opaque.** iOS has no notion of a transparent app icon; a transparent PNG
 *    is composited onto black, which would leave this mark floating on a dark
 *    square next to every other app's solid tile.
 *  - **Light tile.** The mark is orange, red and blue. The previous version of
 *    this file sat white "SA" letters on an indigo-to-violet gradient — which
 *    was neither the logo nor its palette, and would have fought both. The sand
 *    surface is the canvas the logo was drawn against and the one the site
 *    already uses.
 *
 * Next wires the `<link rel="apple-touch-icon">` by file convention; there is
 * no metadata entry to add.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const sand = themePresets.sand;

/* Same source file as `/icon` and `favicon.ico`. See the note in `icon.tsx`
   for why this is read rather than inlined. */
const markDataUri = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public", "logo-mark.png"),
).toString("base64")}`;

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
          background: sand.surface,
        }}
      >
        {/* A tighter inset than `/icon`: iOS applies its own rounded-rectangle
            mask, and artwork that runs close to the edge gets clipped by it. */}
        {/*
          eslint-disable-next-line @next/next/no-img-element --
          `next/image` cannot be used here. This tree is rendered by Satori
          inside `ImageResponse`, which understands a small subset of HTML and
          CSS and has no React runtime, no layout engine and no image loader.
          A plain `<img>` with a data URI is the supported way to place a
          bitmap in a generated OG or icon image; the rule is warning about an
          LCP cost that does not exist in a PNG produced at build time.
        */}
        <img
          src={markDataUri}
          alt=""
          height={Math.round(size.height * 0.64)}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    size,
  );
}
