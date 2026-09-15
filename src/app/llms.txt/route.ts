import { site, contact } from "@/constants/site";
import { caseStudyPath, routes } from "@/constants/navigation";
import { projects } from "@/data/projects";
import { primaryServices, supportingServices } from "@/data/services";
import { faqGroups } from "@/data/faq";

/**
 * `/llms.txt` — a curated Markdown index for the crawlers that read on a
 * searcher's behalf.
 *
 * Generated from the same data the pages render, for the same reason
 * `sitemap.ts` is: a hand-maintained copy of the site's structure drifts, and a
 * stale index is worse than none because it describes a site that no longer
 * exists. Adding a case study or a service updates this file by itself.
 *
 * Honest about what it is: llms.txt is a community convention with no standards
 * body behind it, and as of early 2026 no major AI vendor has publicly
 * committed to reading it in production. It is cheap, it cannot hurt, and it is
 * not a guaranteed win. The thing that actually earns citations is the visible
 * prose — a direct answer in the first sentence of each section — which is why
 * `data/faq.ts` is written the way it is.
 *
 * A Route Handler rather than a static `public/llms.txt`, and `force-static` so
 * it prerenders at build time and is served from the CDN like every other route.
 */
export const dynamic = "force-static";

function section(heading: string, lines: string[]): string {
  return `## ${heading}\n\n${lines.join("\n")}\n`;
}

export function GET(): Response {
  const url = (path: string) => `${site.url}${path}`;

  const body = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is a software development company founded in ${site.foundedYear}, working with businesses and schools across ${contact.regions.join(" and ")}. We build custom systems — SaaS products, ERP for schools and growing companies, mobile apps and online stores — rather than configuring off-the-shelf software.`,
    "",
    section("Pages", [
      `- [Home](${url(routes.home)}): What we build and who we build it for.`,
      `- [Services](${url(routes.services)}): The four primary services and the supporting work around them.`,
      `- [Case studies](${url(routes.work)}): Systems that went live, written up in full.`,
      `- [Common questions](${url(routes.faq)}): Direct answers on cost, timelines, ownership and security.`,
      `- [Contact](${url(routes.contact)}): How to reach us, and what happens after you do.`,
    ]),
    section(
      "Services",
      [
        ...primaryServices.map((s) => `- **${s.title}**: ${s.summary}`),
        ...supportingServices.map((s) => `- ${s.title}: ${s.summary}`),
      ],
    ),
    section(
      "Case studies",
      projects.map(
        (p) => `- [${p.title}](${url(caseStudyPath(p.id))}) — ${p.client}. ${p.summary}`,
      ),
    ),
    section(
      "What we are asked most",
      faqGroups.flatMap((group) =>
        group.items.map((item) => `- ${item.question}`),
      ),
    ),
    section("Contact", [
      `- Email: ${contact.email}`,
      ...contact.phones.map((p) => `- ${p.label}: ${p.display}`),
      `- Regions served: ${contact.regions.join(", ")}`,
      `- Typical first response: ${contact.responseTime}`,
    ]),
    "## Notes",
    "",
    "- Client reviews on this site are transcribed verbatim from our Google Business Profile. We do not publish invented testimonials.",
    "- We do not publish performance figures for client systems unless the client measured them and agreed to us quoting them.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
