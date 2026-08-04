import type { IconName } from "@/components/ui/Icon";

export interface ProcessStep {
  id: string;
  /** Displayed as a zero-padded ordinal, derived from array position. */
  title: string;
  description: string;
  /** Indicative duration. Shown as a small label on the step. */
  duration: string;
  /** What the client physically receives at the end of this step. */
  output: string;
  icon: IconName;
}

/**
 * Delivery process.
 *
 * Written to answer the question every prospect actually has: what happens after
 * I sign, and when do I see something? Each step therefore names a concrete
 * output rather than describing an activity.
 */
export const processSteps: ProcessStep[] = [
  {
    id: "discovery",
    title: "Discovery",
    description:
      "We map the business problem, the people who touch it and the systems already in play. This is where we find the constraints that would otherwise surface in month three.",
    duration: "1–2 weeks",
    output: "Requirements brief and risk register",
    icon: "search",
  },
  {
    id: "planning",
    title: "Architecture & planning",
    description:
      "Technical approach, data model, integration points and a release plan broken into sprints. You approve the architecture before any code is written.",
    duration: "1 week",
    output: "Architecture decision record and sprint plan",
    icon: "blueprint",
  },
  {
    id: "design",
    title: "UI/UX design",
    description:
      "Wireframes to high-fidelity, interactive prototypes. Stakeholders click through the real flows and sign off on them while changes are still cheap.",
    duration: "2–3 weeks",
    output: "Interactive prototype and design system",
    icon: "palette",
  },
  {
    id: "development",
    title: "Development",
    description:
      "Two-week sprints, each ending in a deployed increment on a staging environment. You review working software continuously instead of waiting for a reveal.",
    duration: "Ongoing sprints",
    output: "Working increment every two weeks",
    icon: "code",
  },
  {
    id: "testing",
    title: "Testing & QA",
    description:
      "Automated test suites in CI, plus manual exploratory passes, load testing and a security review. Bugs are fixed inside the sprint that produced them.",
    duration: "Continuous",
    output: "Test coverage report and security review",
    icon: "check",
  },
  {
    id: "deployment",
    title: "Deployment",
    description:
      "Production infrastructure as code, a zero-downtime release, monitoring wired up and a rollback path proven before go-live.",
    duration: "1 week",
    output: "Live production environment and runbook",
    icon: "rocket",
  },
  {
    id: "support",
    title: "Support & evolution",
    description:
      "Defined response targets, security patching and a quarterly roadmap review. The product keeps improving instead of slowly decaying.",
    duration: "Retainer",
    output: "SLA, monitoring dashboards and roadmap",
    icon: "lifebuoy",
  },
];
