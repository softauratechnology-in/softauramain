/**
 * Navigation model.
 *
 * The home page is a single scrolling document, so nav items are hash targets.
 * Each `href` must match the `id` of a rendered section — `SECTION_IDS` is the
 * shared source of truth so a rename cannot silently break a link.
 */

export const SECTION_IDS = {
  hero: "home",
  services: "services",
  whyUs: "why-us",
  technology: "technology",
  work: "work",
  process: "process",
  testimonials: "testimonials",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export interface NavItem {
  label: string;
  href: string;
}

/** Primary navbar links. Kept to five — more than that and the bar gets noisy. */
export const primaryNav: NavItem[] = [
  { label: "Services", href: `#${SECTION_IDS.services}` },
  { label: "Technology", href: `#${SECTION_IDS.technology}` },
  { label: "Work", href: `#${SECTION_IDS.work}` },
  { label: "Process", href: `#${SECTION_IDS.process}` },
  { label: "Contact", href: `#${SECTION_IDS.contact}` },
];

/** Footer sitemap column. Broader than the navbar. */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Company",
    items: [
      { label: "Why Softaura", href: `#${SECTION_IDS.whyUs}` },
      { label: "Our Process", href: `#${SECTION_IDS.process}` },
      { label: "Case Studies", href: `#${SECTION_IDS.work}` },
      { label: "Testimonials", href: `#${SECTION_IDS.testimonials}` },
    ],
  },
  {
    heading: "Services",
    items: [
      { label: "SaaS Development", href: `#${SECTION_IDS.services}` },
      { label: "Web Applications", href: `#${SECTION_IDS.services}` },
      { label: "Mobile Apps", href: `#${SECTION_IDS.services}` },
      { label: "AI Integration", href: `#${SECTION_IDS.services}` },
    ],
  },
];

/** The single primary conversion action, reused by navbar, hero and footer. */
export const primaryCta = {
  label: "Book a discovery call",
  href: `#${SECTION_IDS.contact}`,
} as const;

export const secondaryCta = {
  label: "See our work",
  href: `#${SECTION_IDS.work}`,
} as const;
