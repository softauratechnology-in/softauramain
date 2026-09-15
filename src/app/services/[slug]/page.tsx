import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { LandingPageView } from "@/sections/LandingPageView";
import { servicePages, getLandingPage } from "@/data/landingPages";
import { servicePath, routes } from "@/constants/navigation";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";

/**
 * Service landing pages.
 *
 * Statically generated from `data/landingPages.ts`, the same way `/work/[slug]`
 * is generated from `data/projects.ts`. `getLandingPage` is scoped by section,
 * so `/services/erp-software` correctly 404s rather than serving the solutions
 * page at a second URL — duplicate content at two addresses is a real cost,
 * and the one thing a shared data file makes easy to get wrong.
 */

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.id }));
}

export async function generateMetadata(
  props: PageProps<"/services/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getLandingPage("services", slug);

  if (!page) return {};

  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: servicePath(page.id),
  });
}

export default async function ServiceLandingRoute(
  props: PageProps<"/services/[slug]">,
) {
  const { slug } = await props.params;
  const page = getLandingPage("services", slug);

  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: page.title,
          description: page.metaDescription,
          path: servicePath(page.id),
          serviceType: page.keyword,
        })}
      />
      <JsonLd data={faqSchema(page.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Services", path: routes.services },
          { name: page.title, path: servicePath(page.id) },
        ])}
      />

      <LandingPageView page={page} />
    </>
  );
}
