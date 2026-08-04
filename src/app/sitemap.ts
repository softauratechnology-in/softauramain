import type { MetadataRoute } from "next";
import { site } from "@/constants/site";

/**
 * Sitemap.
 *
 * The site is currently a single document, so this is one entry. When routes are
 * added (a blog, per-service pages), push them here — Next.js serves the result at
 * `/sitemap.xml` automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
