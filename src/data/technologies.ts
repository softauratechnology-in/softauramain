import type { IconName } from "@/components/ui/Icon";

export interface Technology {
  name: string;
  /** Short note on where this sits in the stack. Shown on hover. */
  note: string;
}

export interface TechCategory {
  id: string;
  label: string;
  /** What this layer is responsible for — the card's subtitle. */
  description: string;
  icon: IconName;
  items: Technology[];
}

/**
 * Technology, grouped by what it is responsible for.
 *
 * Two audiences read this section and they need different things, so the copy
 * is split by field rather than watered down for both. `description` is the
 * plain-English promise a non-technical buyer can evaluate — it is the card's
 * visible subtitle. `note` is the detail behind each name, revealed on hover,
 * and is allowed to be concrete because by then the reader has chosen to look.
 * Even so, notes say what a thing *does for you*, not what category of software
 * it belongs to.
 *
 * Names are plain text rather than vendor logos on purpose: third-party logos
 * carry trademark usage terms, and a wall of them reads as filler. Swap to
 * logos only with the assets and permission in hand.
 */
export const techCategories: TechCategory[] = [
  {
    id: "frontend",
    label: "What people see",
    description: "Screens that stay fast as the system grows.",
    icon: "browser",
    items: [
      { name: "React", note: "The screens themselves" },
      { name: "Next.js", note: "Pages that load quickly and rank well" },
      { name: "TypeScript", note: "Catches whole classes of bug before release" },
      { name: "Tailwind CSS", note: "Keeps every screen visually consistent" },
      { name: "Accessibility", note: "Usable with a keyboard and a screen reader" },
    ],
  },
  {
    id: "backend",
    label: "What does the work",
    description: "The engine room — it holds up when everyone logs in at once.",
    icon: "server",
    items: [
      { name: "Node.js", note: "Fast responses, and live updates where needed" },
      { name: "Java", note: "For systems that need to run for a decade" },
      { name: "Spring Boot", note: "Money and records handled correctly" },
      { name: "REST & GraphQL", note: "How your apps and partners connect in" },
      { name: "Python", note: "Reporting, data work and AI features" },
    ],
  },
  {
    id: "database",
    label: "Where your data lives",
    description: "Organised around the questions you will actually ask of it.",
    icon: "database",
    items: [
      { name: "PostgreSQL", note: "Records that stay correct under pressure" },
      { name: "MongoDB", note: "For data whose shape changes over time" },
      { name: "MySQL", note: "Well-proven, widely supported" },
      { name: "Redis", note: "Keeps frequently used data instant" },
      { name: "Vector search", note: "Lets AI features search your own content" },
    ],
  },
  {
    id: "cloud",
    label: "Where it runs",
    description: "Updates that go out safely, and no surprise outages.",
    icon: "cloud",
    items: [
      { name: "AWS", note: "Hosting, in the region you need it" },
      { name: "Docker", note: "Runs the same everywhere, so releases hold no surprises" },
      { name: "Automated testing", note: "Every change is checked before it ships" },
      { name: "Terraform", note: "Your setup is written down, not remembered" },
      { name: "Monitoring", note: "We hear about problems before your users call" },
    ],
  },
];

/** Flat list for the scrolling marquee ticker. */
export const allTechnologyNames = techCategories.flatMap((category) =>
  category.items.map((item) => item.name),
);
