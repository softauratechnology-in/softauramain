import type { MetadataRoute } from "next";
import { site } from "@/constants/site";
import {
  articlePath,
  caseStudyPath,
  landingPath,
  locationPath,
  routes,
} from "@/constants/navigation";
import { projects } from "@/data/projects";
import { landingPages } from "@/data/landingPages";
import { locations } from "@/data/locations";
import { articles } from "@/data/articles";

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
    { url: `${site.url}${routes.solutions}`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}${routes.work}`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}${routes.insights}`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}${routes.faq}`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}${routes.contact}`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = pages.map((entry) => ({
    ...entry,
    lastModified,
  }));

  /* The keyword landing pages, at the same priority as the hubs above them.
     These are the pages people arrive on from a search — ranking them below
     the hub would be describing our own site backwards. */
  const landings: MetadataRoute.Sitemap = landingPages.map((page) => ({
    url: `${site.url}${landingPath(page.section, page.id)}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const cities: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${site.url}${locationPath(location.id)}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  /* `lastModified` is the article's own date, not today's. A sitemap that
     claims every page changed this morning is one a crawler learns to distrust,
     and these are the pages where the real date carries information. */
  const posts: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${site.url}${articlePath(article.id)}`,
    lastModified: new Date(article.updated ?? article.published),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const caseStudies: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}${caseStudyPath(project.id)}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...landings, ...cities, ...posts, ...caseStudies];
}
