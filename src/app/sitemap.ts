import type { MetadataRoute } from "next";
import { site } from "@/constants/site";
import { caseStudyPath, routes } from "@/constants/navigation";
import { projects } from "@/data/projects";

/**
 * Sitemap.
 *
 * Derived from the same `routes` map and `projects` list the site renders from,
 * so a new case study appears here without anyone remembering to add it. Next.js
 * serves the result at `/sitemap.xml` automatically.
 *
 * `priority` is relative *within this file only* — search engines use it to rank
 * our own URLs against each other, not against anyone else's.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  /* Annotated before the `.map()`: without it TypeScript widens each
     `changeFrequency` to `string`, which the sitemap type rejects. */
  const pages: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}${routes.services}`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}${routes.work}`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}${routes.faq}`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}${routes.contact}`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = pages.map((entry) => ({
    ...entry,
    lastModified,
  }));

  const caseStudies: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}${caseStudyPath(project.id)}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...caseStudies];
}
