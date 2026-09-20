import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The square app icon — served at `/icon`.
 *
 * Used for the web app manifest and by browsers that prefer a PNG over the
 * `.ico`. `favicon.ico` covers the browser tab and is built from the same
 * source by a script in the scratchpad; the two are generated from one file so
 * they cannot drift apart.
 *
 * This used to draw the letters "SA" on an indigo gradient. That was wrong in
 * two ways at once: it was not the logo, and indigo is not in the logo's
 * palette — the mark is orange, red and blue. It now renders
 * `public/logo-mark.png` itself.
 *
 * Read from disk at module scope rather than inlined as base64: the file is
 * 81KB, and a base64 constant in source would be 108KB of noise that silently
 * goes stale the moment the logo is replaced. This route prerenders at build
 * time, so the read happens once, on the build machine.
 *
 * Background stays transparent. This is a general-purpose icon: a browser
 * paints it on whatever chrome it has, light or dark, and Android composites a
 * transparent PWA icon on its own tile. `apple-icon` is the one that must be
 * opaque, and it is.
 */

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

const markDataUri = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public", "logo-mark.png"),
).toString("base64")}`;

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
        }}
      >
        {/* The mark is 537x639 — taller than wide. Height-constrained with the
            width left to follow, so the monogram keeps its proportions instead
            of being stretched into the square. The 12% inset stops it touching
            the edges when a launcher rounds the corners. */}
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
          height={Math.round(size.height * 0.76)}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    size,
  );
}
