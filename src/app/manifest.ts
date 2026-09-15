import type { MetadataRoute } from "next";
import { site } from "@/constants/site";
import { semantic } from "@/styles/colors";

/**
 * Web app manifest.
 *
 * Deliberately minimal. This is a marketing site, not an app: there is no
 * service worker, no offline mode and nothing to do once installed, so
 * `display: "browser"` is honest — it keeps the browser chrome instead of
 * pretending to be standalone and stranding someone in a window with no back
 * button. What the manifest is actually here for is the name, the theme colour
 * and a square icon for an Android home-screen add, which otherwise falls back
 * to a screenshot the way iOS did before `apple-icon.tsx`.
 *
 * The icon paths are the generated routes from `icon.tsx` / `apple-icon.tsx`.
 * Next serves those at the bare path as well as the hashed one it writes into
 * the `<link>` tags, so referencing them without a hash stays correct when the
 * icon changes.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: semantic.background,
    theme_color: semantic.background,
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
