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
    title: "Tools chosen for your problem",
    description:
      "We choose the technology per project and tell you why, in language you can hold us to. Nothing gets picked because it is fashionable, or because it would look good on our engineers' CVs — you should not inherit a system nobody else can be hired to maintain.",
    icon: "code",
  },
  {
    id: "scalable-architecture",
    title: "Built to still fit you in three years",
    description:
      "The decisions that are expensive to reverse — how your data is organised, how the system copes as more people use it — get made deliberately at the start. We spend the time in week one so we do not have to rewrite it in month six.",
    icon: "layers",
  },
  {
    id: "agile-delivery",
    title: "Something working every two weeks",
    description:
      "You get software you can actually use every fortnight, not a status update. You can change direction as you see it take shape, and there is never a six-month silence between signing and seeing something.",
    icon: "refresh",
  },
  {
    id: "security-first",
    title: "Security handled as we build",
    description:
      "Your data is encrypted, people can only reach the records their role requires, and every release is checked for known vulnerabilities. Security is part of being finished, not a scramble the week before launch.",
    icon: "shield",
  },
  {
    id: "long-term-support",
    title: "We stay after launch",
    description:
      "Every project can move onto a support arrangement with agreed response times. The documentation and handover are written for whoever looks after the system next — including your own team, if that is where you want to end up.",
    icon: "lifebuoy",
  },
];
