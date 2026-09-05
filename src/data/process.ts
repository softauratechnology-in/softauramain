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
    title: "Understanding how you work",
    description:
      "We sit with the people who do the work and map what actually happens — including the workarounds nobody wrote down. This is where we find the awkward details that would otherwise surface in month three.",
    duration: "1–2 weeks",
    output: "A written summary of what we will build, and what could go wrong",
    icon: "search",
  },
  {
    id: "planning",
    title: "Planning it out",
    description:
      "How the system will be put together, what connects to what, and the order we will build it in. You approve the plan before anyone writes code.",
    duration: "1 week",
    output: "A build plan you have agreed to, in plain language",
    icon: "blueprint",
  },
  {
    id: "design",
    title: "Designing the screens",
    description:
      "Rough sketches through to a version you can click through as if it were real. Your team tries it and tells us what is wrong while changing it is still cheap.",
    duration: "2–3 weeks",
    output: "A clickable version of the system to try",
    icon: "palette",
  },
  {
    id: "development",
    title: "Building it",
    description:
      "We build in two-week blocks, and at the end of each one there is something working for you to use — not a progress report. You see it come together instead of waiting for a reveal.",
    duration: "Two-week cycles",
    output: "Something working to try, every two weeks",
    icon: "code",
  },
  {
    id: "testing",
    title: "Testing",
    description:
      "Automatic checks run on every change, and we test by hand as well — including how the system behaves when a lot of people use it at once, and whether anyone can reach data they should not. Problems are fixed in the cycle that caused them.",
    duration: "Throughout",
    output: "A written account of what was tested, including security",
    icon: "check",
  },
  {
    id: "deployment",
    title: "Going live",
    description:
      "We put it live without taking the system down, set up the alerts that tell us if something goes wrong, and prove we can undo the release before we need to.",
    duration: "1 week",
    output: "A live system, plus written instructions for running it",
    icon: "rocket",
  },
  {
    id: "support",
    title: "Staying on afterwards",
    description:
      "Agreed response times, security updates applied as they are released, and a review every quarter of what to improve next. The system keeps getting better instead of quietly ageing.",
    duration: "Ongoing",
    output: "Agreed response times, monitoring and a roadmap",
    icon: "lifebuoy",
  },
];
