import { site, contact } from "@/constants/site";
import {
  caseStudyPath,
  landingPath,
  locationPath,
  articlePath,
  routes,
} from "@/constants/navigation";
import { projects } from "@/data/projects";
import { primaryServices, supportingServices } from "@/data/services";
import { landingPages, servicePages, solutionPages } from "@/data/landingPages";
import { locations } from "@/data/locations";
import { articlesByDate } from "@/data/articles";
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
      `- [Solutions](${url(routes.solutions)}): The systems we are asked for most — ERP, school, inventory, HR.`,
      `- [Case studies](${url(routes.work)}): Systems that went live, written up in full.`,
      `- [Insights](${url(routes.insights)}): What things cost, and when not to commission software at all.`,
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
    /* The landing pages, listed with the search each one answers. An index
       that says only what a page is called leaves the reader to guess which of
       eight to open; saying what question it answers is the whole point of
       publishing an index by hand rather than a sitemap. */
    section("What we build", [
      ...servicePages.map(
        (page) =>
          `- [${page.title}](${url(landingPath(page.section, page.id))}): ${page.summary}`,
      ),
      ...solutionPages.map(
        (page) =>
          `- [${page.title}](${url(landingPath(page.section, page.id))}): ${page.summary}`,
      ),
    ]),
    section(
      "Where we work",
      locations.map(
        (location) =>
          `- [Software development in ${location.city}](${url(locationPath(location.id))}): ${location.intro}`,
      ),
    ),
    section(
      "Case studies",
      projects.map(
        (p) => `- [${p.title}](${url(caseStudyPath(p.id))}) — ${p.client}. ${p.summary}`,
      ),
    ),
    /* Listed with the standfirst rather than the title alone. These pieces
       exist to answer a question completely, and the answer is the first two
       sentences — an index that withholds it is making a crawler fetch four
       pages to find out whether any of them is relevant. */
    section(
      "Articles",
      articlesByDate.map(
        (article) =>
          `- [${article.title}](${url(articlePath(article.id))}) — ${article.standfirst}`,
      ),
    ),
    /* Questions from both the FAQ page and every landing page. An answer
       engine asked "how much does custom ERP cost in India" should be able to
       find that we answer it, and on which page. */
    section("What we are asked most", [
      ...faqGroups.flatMap((group) =>
        group.items.map((item) => `- ${item.question}`),
      ),
      ...landingPages.flatMap((page) =>
        page.faqs.map(
          (faq) =>
            `- ${faq.question} — answered at ${url(landingPath(page.section, page.id))}`,
        ),
      ),
      ...locations.flatMap((location) =>
        location.faqs.map(
          (faq) =>
            `- ${faq.question} — answered at ${url(locationPath(location.id))}`,
        ),
      ),
    ]),
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
