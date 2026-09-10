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
  work: "/work",
  faq: "/faq",
  contact: "/contact",
} as const;

export type Route = (typeof routes)[keyof typeof routes];

/** Detail page for one case study. Keep path construction in one place. */
export const caseStudyPath = (slug: string): string => `${routes.work}/${slug}`;

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

/** Primary navbar links. Kept to four — more than that and the bar gets noisy. */
export const primaryNav: NavItem[] = [
  { label: "Services", href: routes.services },
  { label: "Work", href: routes.work },
  { label: "FAQ", href: routes.faq },
  { label: "Contact", href: routes.contact },
];

/** Footer sitemap columns. Broader than the navbar. */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Company",
    items: [
      { label: "Case studies", href: routes.work },
      { label: "How we work", href: `${routes.services}#${SECTION_IDS.process}` },
      { label: "Common questions", href: routes.faq },
      { label: "Start a project", href: routes.contact },
    ],
  },
  {
    heading: "Services",
    items: [
      { label: "SaaS products", href: `${routes.services}#saas-development` },
      { label: "Custom ERP systems", href: `${routes.services}#custom-erp` },
      { label: "Mobile apps", href: `${routes.services}#mobile-apps` },
      { label: "Online stores", href: `${routes.services}#ecommerce` },
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
