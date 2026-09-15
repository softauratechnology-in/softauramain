/**
 * Navigation model.
 *
 * The site is a multi-page app: nav items are real routes, and `usePathname()`
 * in the navbar decides which one is current. `routes` is the single source of
 * truth — never write a path as a string literal in a component, because a
 * rename then has to be found by grep instead of by the type checker.
 *
 * Hash targets still exist, but only *within* a page (the services list on
 * `/services`, the process block below it). Those live in `SECTION_IDS`.
 */

export const routes = {
  home: "/",
  services: "/services",
  solutions: "/solutions",
  work: "/work",
  insights: "/insights",
  faq: "/faq",
  contact: "/contact",
} as const;

export type Route = (typeof routes)[keyof typeof routes];

/** Detail page for one case study. Keep path construction in one place. */
export const caseStudyPath = (slug: string): string => `${routes.work}/${slug}`;

/**
 * Keyword landing pages. Two segments rather than one because the split is
 * meaningful to a reader — see the header of `data/landingPages.ts` — and
 * because a URL that says `/solutions/erp-software` describes the thing the
 * searcher asked for, which is half of why they click.
 */
export const servicePath = (slug: string): string => `${routes.services}/${slug}`;
export const solutionPath = (slug: string): string => `${routes.solutions}/${slug}`;

/** Resolves a landing page to its URL without the caller knowing the section. */
export const landingPath = (
  section: "services" | "solutions",
  slug: string,
): string => (section === "services" ? servicePath(slug) : solutionPath(slug));

/** City hub — `/locations/chennai`. */
export const locationPath = (slug: string): string => `/locations/${slug}`;

/** Article detail. */
export const articlePath = (slug: string): string => `${routes.insights}/${slug}`;

/**
 * In-page anchor targets. Each must match the `id` of a rendered section — a
 * shared constant so a rename cannot silently break a link.
 */
export const SECTION_IDS = {
  hero: "home",
  services: "services",
  whyUs: "why-us",
  work: "work",
  process: "process",
  technology: "how-we-build",
  reviews: "reviews",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Primary navbar links.
 *
 * Five, not four. `Solutions` earns the extra slot because the landing pages
 * beneath it are the ones people arrive on from search, and a page reachable
 * only from the footer accumulates a fraction of the internal link value of one
 * in the main navigation. The bar is `lg:` and up, where five short labels fit
 * comfortably alongside the wordmark and the CTA.
 */
export const primaryNav: NavItem[] = [
  { label: "Services", href: routes.services },
  { label: "Solutions", href: routes.solutions },
  { label: "Work", href: routes.work },
  { label: "FAQ", href: routes.faq },
  { label: "Contact", href: routes.contact },
];

/**
 * Footer sitemap columns. Broader than the navbar.
 *
 * These now point at the real landing pages rather than at anchors on
 * `/services`. That is the substantive change: an anchor is the same URL as far
 * as a search engine is concerned, so four footer links to `/services#...` were
 * four links to one page. Pointing them at distinct URLs is what lets each one
 * accumulate its own standing.
 */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Company",
    items: [
      { label: "Case studies", href: routes.work },
      { label: "How we work", href: `${routes.services}#${SECTION_IDS.process}` },
      { label: "Insights", href: routes.insights },
      { label: "Common questions", href: routes.faq },
      { label: "Start a project", href: routes.contact },
    ],
  },
  {
    heading: "Services",
    items: [
      { label: "Website development", href: servicePath("web-development") },
      { label: "Web applications", href: servicePath("web-application-development") },
      { label: "Mobile apps", href: servicePath("mobile-app-development") },
      { label: "E-commerce", href: servicePath("ecommerce-development") },
    ],
  },
  {
    heading: "Solutions",
    items: [
      { label: "Custom ERP software", href: solutionPath("erp-software") },
      { label: "School management software", href: solutionPath("school-management-software") },
      { label: "Inventory management", href: solutionPath("inventory-management-software") },
      { label: "HR & people management", href: solutionPath("people-management-software") },
    ],
  },
  {
    heading: "Where we work",
    items: [
      { label: "Software development in Chennai", href: locationPath("chennai") },
      { label: "Software development in Dubai", href: locationPath("dubai") },
    ],
  },
];

/** The single primary conversion action, reused by navbar, hero and footer. */
export const primaryCta = {
  label: "Book a free consultation",
  href: routes.contact,
} as const;

export const secondaryCta = {
  label: "See our work",
  href: routes.work,
} as const;
