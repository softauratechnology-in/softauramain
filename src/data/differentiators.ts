import type { IconName } from "@/components/ui/Icon";

export interface Differentiator {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

/**
 * "Why choose us" content.
 *
 * Each item states a practice and what it means for the client. Claims here are
 * about how the team works — deliberately no unverified metrics, awards or
 * client counts, which is where agency sites usually start inventing numbers.
 */
export const differentiators: Differentiator[] = [
  {
    id: "senior-team",
    title: "Senior engineers, no hand-offs",
    description:
      "The people who scope your project are the people who build it. No junior bait-and-switch after the contract is signed, and no context lost between a sales team and a delivery team.",
    icon: "users",
  },
  {
    id: "modern-stack",
    title: "A stack chosen for your problem",
    description:
      "We work in TypeScript, React, Node and Java day to day — but we pick per project, and we tell you why. No resume-driven architecture, no framework you will struggle to hire for later.",
    icon: "code",
  },
  {
    id: "scalable-architecture",
    title: "Architecture that survives growth",
    description:
      "Multi-tenancy, caching strategy and data partitioning get decided up front, not retrofitted at ten thousand users. The cost of getting this wrong is a rewrite; we would rather spend the time in week one.",
    icon: "layers",
  },
  {
    id: "agile-delivery",
    title: "Two-week cycles, working software",
    description:
      "You see a deployed, usable increment every sprint — not a status deck. Scope stays negotiable, direction stays yours, and there are no six-month gaps between contract and first demo.",
    icon: "refresh",
  },
  {
    id: "security-first",
    title: "Security handled as we build",
    description:
      "Threat modelling, least-privilege access, encrypted data at rest and in transit, and dependency scanning in CI. Security review is part of the definition of done, not a pre-launch scramble.",
    icon: "shield",
  },
  {
    id: "long-term-support",
    title: "We stay after launch",
    description:
      "Every engagement can move onto a support retainer with defined response targets. Documentation and handover are written for whoever maintains the system next — including your own team.",
    icon: "lifebuoy",
  },
];
