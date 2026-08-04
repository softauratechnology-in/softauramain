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
   * Marks the two or three services the company leads with. Featured cards
   * span two grid columns and get the gradient border treatment.
   */
  featured?: boolean;
}

/**
 * Service catalogue — the commercial spine of the site.
 *
 * Copy is written from the buyer's point of view (outcome first, technology
 * second). Order is intentional: revenue-driving engagement types first,
 * retainer and support work last.
 */
export const services: Service[] = [
  {
    id: "saas-development",
    title: "SaaS Product Development",
    summary:
      "End-to-end delivery of multi-tenant SaaS platforms — from the first architecture decision through to a billed, production product your customers can sign up for.",
    deliverables: [
      "Multi-tenant architecture and tenant isolation",
      "Subscription billing and metered usage",
      "Role-based access control and admin tooling",
      "Analytics, audit trails and usage reporting",
    ],
    icon: "layers",
    featured: true,
  },
  {
    id: "web-applications",
    title: "Enterprise Web Applications",
    summary:
      "Business-critical web systems — ERP, CRM, operations dashboards and internal tooling — built to hold up under real workloads and real audit requirements.",
    deliverables: [
      "Domain modelling and workflow design",
      "Complex reporting and data grids",
      "Third-party and legacy system integration",
      "Single sign-on and permissions",
    ],
    icon: "browser",
    featured: true,
  },
  {
    id: "mobile-apps",
    title: "Mobile App Development",
    summary:
      "Native and cross-platform apps that extend your product to the phone without splitting your roadmap in two.",
    deliverables: [
      "iOS and Android from one codebase",
      "Offline-first data synchronisation",
      "Push notifications and deep linking",
      "App Store and Play Store release management",
    ],
    icon: "device",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX & Product Design",
    summary:
      "Interface design grounded in how your users actually work — validated with prototypes before a line of production code is written.",
    deliverables: [
      "Discovery workshops and user journey mapping",
      "Interactive prototypes for stakeholder sign-off",
      "Design systems and component libraries",
      "Accessibility review to WCAG 2.2 AA",
    ],
    icon: "palette",
  },
  {
    id: "cloud-solutions",
    title: "Cloud Architecture",
    summary:
      "Infrastructure sized to what you run today and ready for what you run next quarter — without a surprise bill at the end of the month.",
    deliverables: [
      "AWS landing zone and network design",
      "Containerised workloads and autoscaling",
      "Cost modelling and rightsizing",
      "Backup, failover and disaster recovery",
    ],
    icon: "cloud",
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    summary:
      "Practical AI inside your existing product — retrieval over your own data, document processing, assistive workflows — scoped to a measurable outcome, not a demo.",
    deliverables: [
      "Retrieval-augmented search over private data",
      "Document extraction and classification pipelines",
      "LLM-assisted workflows with human review",
      "Evaluation harnesses and guardrails",
    ],
    icon: "sparkle",
    featured: true,
  },
  {
    id: "devops",
    title: "DevOps & Deployment",
    summary:
      "The delivery pipeline that lets your team ship on a Friday afternoon: automated, observable and reversible.",
    deliverables: [
      "CI/CD pipelines with automated gates",
      "Infrastructure as code",
      "Monitoring, logging and alerting",
      "Zero-downtime and blue-green releases",
    ],
    icon: "pipeline",
  },
  {
    id: "support",
    title: "Maintenance & Support",
    summary:
      "Long-term ownership under a clear SLA — dependency upgrades, security patching and a roadmap that keeps moving after launch.",
    deliverables: [
      "Defined response and resolution targets",
      "Security patching and dependency upgrades",
      "Performance monitoring and tuning",
      "Quarterly roadmap and health reviews",
    ],
    icon: "shield",
  },
];

/** Featured subset, for use anywhere a condensed service list is needed. */
export const featuredServices = services.filter((service) => service.featured);
