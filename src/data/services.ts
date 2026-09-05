import type { IconName } from "@/components/ui/Icon";

export interface Service {
  /** Stable key — used as the React key and as an anchor fragment. */
  id: string;
  title: string;
  /** One-sentence promise. Shown on the card at rest. */
  summary: string;
  /** Concrete deliverables. Keep to four; they render as a bulleted list. */
  deliverables: string[];
  icon: IconName;
  /**
   * `primary` — the four things we want to be hired for. These lead the
   * services page and are the only ones teased on the home page.
   * `supporting` — real capabilities, but ones a buyer arrives needing *as part
   * of* a primary engagement rather than on their own.
   */
  tier: "primary" | "supporting";
  /**
   * Marks the services the company leads with. Featured cards span two grid
   * columns and get the gradient border treatment.
   */
  featured?: boolean;
}

/**
 * Service catalogue — the commercial spine of the site.
 *
 * Copy rule: a school administrator or a non-technical founder has to be able
 * to read every line and know whether it applies to them. Outcome first, and
 * where a technical term is genuinely load-bearing it is explained in the same
 * breath rather than assumed ("one codebase, so features land on both at once"
 * rather than "cross-platform"). Stack names live on the services page's "how
 * we build" block, not here.
 *
 * Order is intentional: the four primary engagement types first, then the
 * supporting work, retainer last.
 */
export const services: Service[] = [
  {
    id: "saas-development",
    title: "SaaS Products",
    summary:
      "Software you sell by subscription — built so a customer can find you, sign up, pay and start using it without anyone on your team touching the process.",
    deliverables: [
      "Sign-up, subscriptions and recurring billing",
      "Separate, private workspaces for every customer",
      "Admin controls and permission levels for your team",
      "Usage reporting, so you can see what people actually use",
    ],
    icon: "layers",
    tier: "primary",
    featured: true,
  },
  {
    id: "custom-erp",
    title: "Custom ERP & Business Systems",
    summary:
      "One system that replaces the spreadsheets, paper files and WhatsApp threads your organisation currently runs on — built around how you already work, not the other way round.",
    deliverables: [
      "Admissions, records, attendance, fees, inventory or orders",
      "A different view for each role — staff, management, parents, customers",
      "Reports and exports your team can run without asking us",
      "Connects to the systems you already pay for",
    ],
    icon: "browser",
    tier: "primary",
    featured: true,
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    summary:
      "iPhone and Android apps built from a single codebase, so a new feature reaches both at the same time instead of being budgeted twice.",
    deliverables: [
      "One app, both app stores",
      "Keeps working when the signal drops, syncs when it returns",
      "Push notifications that reach the right people",
      "We handle the App Store and Play Store submissions",
    ],
    icon: "device",
    tier: "primary",
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    summary:
      "Online stores that are quick to browse, simple to check out of, and straightforward for your team to run once we hand them over.",
    deliverables: [
      "Product catalogue, cart and checkout",
      "Payment and delivery options that suit your market",
      "Stock, orders and customers in one place",
      "Built to be found in search from day one",
    ],
    icon: "cart",
    tier: "primary",
  },
  {
    id: "ui-ux-design",
    title: "Design & User Experience",
    summary:
      "We design the screens and test them with real users before anything is built — changing a drawing is cheap, changing a finished system is not.",
    deliverables: [
      "Sessions with the people who will actually use it",
      "A clickable version to try before development starts",
      "A consistent look that carries across every screen",
      "Checked against accessibility standards (WCAG 2.2 AA)",
    ],
    icon: "palette",
    tier: "supporting",
  },
  {
    id: "cloud-solutions",
    title: "Hosting & Infrastructure",
    summary:
      "Somewhere secure and reliable for your software to run — sized for today's usage, ready for next year's, and with no surprise bill at the end of the month.",
    deliverables: [
      "Handles busy periods without falling over",
      "Costs modelled up front, and reviewed as you grow",
      "Backups, and a tested plan for when something fails",
      "Private by default — your data stays yours",
    ],
    icon: "cloud",
    tier: "supporting",
  },
  {
    id: "ai-integration",
    title: "AI Features",
    summary:
      "Practical AI inside the product you already have — searching your own documents, reading paperwork, drafting the repetitive parts. Scoped to a result you can measure, not a demo.",
    deliverables: [
      "Ask-a-question search across your own files and records",
      "Pulling data out of invoices, forms and documents",
      "A person stays in the loop on anything that matters",
      "Tested for accuracy before it goes anywhere near customers",
    ],
    icon: "sparkle",
    tier: "supporting",
  },
  {
    id: "devops",
    title: "Releases & Reliability",
    summary:
      "Updates that go out safely, on a normal working day, and can be undone in minutes if something is wrong.",
    deliverables: [
      "Every change tested automatically before it ships",
      "Updates with no downtime for your users",
      "We are alerted to problems before your customers call",
      "Any release can be reversed quickly",
    ],
    icon: "pipeline",
    tier: "supporting",
  },
  {
    id: "support",
    title: "Ongoing Support",
    summary:
      "Long-term ownership with agreed response times — security updates, improvements and a roadmap that keeps moving after launch.",
    deliverables: [
      "Agreed response times, in writing",
      "Security updates applied as they are released",
      "Performance watched and tuned over time",
      "A quarterly review of what to build next",
    ],
    icon: "lifebuoy",
    tier: "supporting",
  },
];

/** The four engagement types the site leads with. */
export const primaryServices = services.filter(
  (service) => service.tier === "primary",
);

/** Everything else — real work, but sold as part of an engagement. */
export const supportingServices = services.filter(
  (service) => service.tier === "supporting",
);

export const featuredServices = services.filter((service) => service.featured);
