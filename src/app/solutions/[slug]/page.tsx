import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { LandingPageView } from "@/sections/LandingPageView";
import { solutionPages, getLandingPage } from "@/data/landingPages";
import { solutionPath, routes } from "@/constants/navigation";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";

/**
 * Solution landing pages.
 *
 * Statically generated from `data/landingPages.ts`, the same way `/work/[slug]`
 * is generated from `data/projects.ts`. These carry the software-category
 * searches — "ERP software", "school management software" — which describe the
 * system a buyer wants to own rather than the work of building it. See the
 * header of the data file for why that is a separate URL space.
 *
 * `getLandingPage` is scoped by section, so `/solutions/web-development`
 * correctly 404s rather than serving a services page at a second address.
 * Duplicate content at two URLs is a real cost, and it is the one thing a
 * shared data file makes easy to get wrong.
 */

export function generateStaticParams() {
  return solutionPages.map((page) => ({ slug: page.id }));
}

export async function generateMetadata(
  props: PageProps<"/solutions/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getLandingPage("solutions", slug);

  if (!page) return {};

  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: solutionPath(page.id),
  });
}

export default async function SolutionLandingRoute(
  props: PageProps<"/solutions/[slug]">,
) {
  const { slug } = await props.params;
  const page = getLandingPage("solutions", slug);

  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: page.title,
          description: page.metaDescription,
          path: solutionPath(page.id),
          serviceType: page.keyword,
        })}
      />
      <JsonLd data={faqSchema(page.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Solutions", path: routes.solutions },
          { name: page.title, path: solutionPath(page.id) },
        ])}
      />

      <LandingPageView page={page} />
    </>
  );
}
