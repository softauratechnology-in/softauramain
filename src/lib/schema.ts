import { site, contact } from "@/constants/site";
import { locations } from "@/data/locations";

/**
 * JSON-LD helpers.
 *
 * Every structured-data block on the site is built here rather than inline, for
 * one reason that matters and one that is convenience.
 *
 * The one that matters is the **`@id` graph**. `layout.tsx` publishes an
 * `Organization` and a `WebSite` as a linked `@graph`, and every per-page block
 * refers back to the organisation by `@id` instead of restating the company.
 * That is what makes a search engine read one entity described across many
 * pages rather than twenty-odd unrelated companies that happen to share a name
 * — which matters more than usual here, because four other businesses are
 * already competing for "SoftAura" in the index.
 *
 * The convenience is the escape. `JSON.stringify` does not escape markup, so a
 * `<` anywhere in the data would close the `<script>` tag early. Routing every
 * block through `jsonLd()` means no call site can forget.
 */

/** `@id` of the Organization node published once in `layout.tsx`. */
export const ORGANIZATION_ID = `${site.url}/#organization`;

/**
 * Serialises a JSON-LD object for `dangerouslySetInnerHTML`.
 *
 * The `<` replacement is what the Next.js JSON-LD guide prescribes. It is not
 * optional: project titles, FAQ answers and service copy are all content, and
 * content can contain markup.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\u003c");
}

/** Absolute URL from a route-relative path. */
export function absolute(path: string): string {
  return path === "/" ? site.url : `${site.url}${path}`;
}

/**
 * Breadcrumb trail.
 *
 * The one schema type on this site that changes what a searcher actually sees:
 * Google renders it as the path above the result instead of a bare URL. Always
 * starts at Home, so callers pass only what comes after it.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map(
      (crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absolute(crumb.path),
      }),
    ),
  };
}

/**
 * FAQ block.
 *
 * Still earns visible result real estate for pages like these, and is read by
 * answer engines directly. The answers are published exactly as they are
 * rendered — Google requires that the markup match the visible page, and a
 * mismatch is a manual-action risk rather than a technicality.
 */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** The places we serve, as schema `Place` nodes — derived, never hand-written. */
const AREAS_SERVED = locations.map((location) => ({
  "@type": "Place",
  name: `${location.city}, ${location.country}`,
}));

/**
 * A service offering.
 *
 * `provider` is a reference, not a copy. Restating name, phone and description
 * on every one of these would publish eight competing descriptions of the same
 * company; pointing at `@id` publishes one.
 */
export function serviceSchema({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  /** The search term this page answers, in the searcher's words. */
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absolute(path)}/#service`,
    name,
    description,
    serviceType,
    url: absolute(path),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: AREAS_SERVED,
  };
}

/**
 * A city hub.
 *
 * `ProfessionalService` rather than `LocalBusiness`, and `areaServed` rather
 * than `address`, until a real registered address exists — see the note in
 * `data/locations.ts`. Publishing a `PostalAddress` we cannot stand behind is
 * a Business Profile suspension risk, and a service-area business is a
 * first-class thing to be rather than a lesser one.
 */
export function locationSchema(location: (typeof locations)[number]) {
  const phone = contact.phones.find((p) => p.label === location.phoneLabel);

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${absolute(`/locations/${location.id}`)}/#business`,
    name: `${site.name} — ${location.city}`,
    description: location.metaDescription,
    url: absolute(`/locations/${location.id}`),
    parentOrganization: { "@id": ORGANIZATION_ID },
    email: contact.email,
    ...(phone ? { telephone: `+${phone.e164}` } : {}),
    areaServed: location.areasServed.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    ...(location.address
      ? { address: { "@type": "PostalAddress", ...location.address } }
      : {}),
  };
}

/**
 * A long-form article.
 *
 * `author` and `publisher` both point at the organisation by `@id` rather than
 * naming a person. That is the accurate claim: these are written and reviewed
 * by the team, and inventing a named author with no profile behind them is the
 * kind of detail that reads as authoritative and is not.
 */
export function articleSchema({
  headline,
  description,
  path,
  published,
  updated,
}: {
  headline: string;
  description: string;
  path: string;
  published: string;
  updated?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absolute(path)}/#article`,
    headline,
    description,
    url: absolute(path),
    datePublished: published,
    dateModified: updated ?? published,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": absolute(path) },
  };
}

/** `@id` of the WebSite node published once in `layout.tsx`. */
export const WEBSITE_ID = `${site.url}/#website`;

/**
 * A case study.
 *
 * `WebPage` rather than `Article`, and the reason is dates. Google's Article
 * guidance expects `datePublished`, and `projects.ts` does not record when each
 * engagement shipped — so an `Article` here would either omit the field it is
 * judged on or carry a date somebody invented. `WebPage` asks for neither and
 * describes what the page actually is.
 *
 * The useful part is `about`: the page is a document, the thing it is *about*
 * is the system we built. Splitting those means the description of the software
 * is attached to the software rather than to the write-up of it.
 *
 * `mentions` links the case study to the `Service` nodes it proves, by `@id`.
 * That is the edge worth having — it is how "we build school management
 * software" and "here is a school management system we built" become one claim
 * supported by evidence rather than two unconnected assertions.
 *
 * **Tech stack is emitted only when `stack` is populated.** It is `undefined`
 * on every project today, and `projects.ts` is explicit that technology claims
 * are published only once confirmed. So this renders nothing rather than a
 * plausible guess, and starts working the day those are filled in.
 */
export function caseStudySchema({
  project,
  path,
  demonstrates,
}: {
  project: {
    title: string;
    client: string;
    category: string;
    summary: string;
    description: string;
    tags: string[];
    stack?: string[];
    image: string;
    imageAlt: string;
    url?: string;
  };
  path: string;
  /** `@id`s of the Service nodes this work is evidence for. */
  demonstrates: string[];
}) {
  const stack = project.stack ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absolute(path)}/#webpage`,
    url: absolute(path),
    name: project.title,
    description: project.summary,
    isPartOf: { "@id": WEBSITE_ID },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absolute(project.image),
      caption: project.imageAlt,
    },
    about: {
      "@type": "CreativeWork",
      name: project.title,
      /* The long form: the problem, then what was delivered. */
      description: project.description,
      creator: { "@id": ORGANIZATION_ID },
      genre: project.category,
      keywords: [...project.tags, ...stack].join(", "),
      /* The live system, where the client has agreed to be linked. */
      ...(project.url ? { url: project.url } : {}),
      ...(stack.length > 0
        ? {
            /* Only reached once `stack` is confirmed — see the note above. */
            programmingLanguage: stack,
          }
        : {}),
    },
    ...(demonstrates.length > 0
      ? { mentions: demonstrates.map((id) => ({ "@id": id })) }
      : {}),
  };
}
