import type { Metadata } from "next";
import { site } from "@/constants/site";

/**
 * Per-route metadata, with the social tags filled in.
 *
 * Exists because three of Next's metadata fields do **not** inherit the way you
 * would expect, and all three were wrong on this site before it was added:
 *
 *  - `openGraph.url` does not default to the current route. A page that never
 *    sets it inherits the root's value, so `/services` was telling every
 *    crawler and every share preview that its canonical address was the
 *    homepage.
 *  - `twitter.*` is a separate namespace from `openGraph.*`; Next does not copy
 *    one into the other. A page overriding `openGraph.title` alone still shared
 *    on X under the site-wide title.
 *  - `title.template` applies to the document title only. `openGraph.title` is
 *    a plain string, so the brand suffix has to be written in — which is why
 *    the full title is composed here rather than passed through.
 *
 * `openGraph.images` has to be named explicitly, which is the counter-intuitive
 * one. Next merges metadata per *field*, not deeply — so a child route that
 * declares an `openGraph` object replaces the parent's entire `openGraph`,
 * including the image that `src/app/opengraph-image.tsx` injects there by file
 * convention. Setting `openGraph.url` therefore silently drops the OG image
 * unless the image is re-stated alongside it. Caught by the verification pass:
 * four routes had a correct `og:url` and no `og:image` at all.
 */

/** The generated card from `src/app/opengraph-image.tsx`, resolved by `metadataBase`. */
const OG_IMAGE = "/opengraph-image";
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Route title, without the brand suffix — the template adds that. */
  title: string;
  description: string;
  /** Route-relative path, e.g. `/services`. Resolved by `metadataBase`. */
  path: string;
}): Metadata {
  /* Matches the document-title template in `layout.tsx`. `title.template`
     applies to the document title only, so the brand suffix has to be composed
     by hand here — and if the two ever disagree, a share preview and a search
     result show the same page under two different names. */
  const socialTitle = `${title} | ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.name,
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
