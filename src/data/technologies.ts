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
 * Technology stack, grouped by layer.
 *
 * Rendered as a four-up grid of category cards. Names are plain text rather than
 * vendor logos on purpose: third-party logos carry trademark usage terms, and a
 * wall of them reads as filler. Swap to logos only with the assets and
 * permission in hand.
 */
export const techCategories: TechCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    description: "Interfaces that stay fast as the product grows.",
    icon: "browser",
    items: [
      { name: "React", note: "Component architecture and state" },
      { name: "Next.js", note: "Server rendering, routing and caching" },
      { name: "TypeScript", note: "Type safety across the whole codebase" },
      { name: "Tailwind CSS", note: "Design-system-driven styling" },
      { name: "React Three Fiber", note: "WebGL and 3D interfaces" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    description: "APIs and services that hold up under load.",
    icon: "server",
    items: [
      { name: "Node.js", note: "High-throughput APIs and real-time services" },
      { name: "Java", note: "Long-lived enterprise systems" },
      { name: "Spring Boot", note: "Transactional business services" },
      { name: "REST & GraphQL", note: "Typed, versioned API contracts" },
      { name: "Python", note: "Data pipelines and AI workloads" },
    ],
  },
  {
    id: "database",
    label: "Data",
    description: "Storage modelled around how you actually query it.",
    icon: "database",
    items: [
      { name: "PostgreSQL", note: "Relational core with strong guarantees" },
      { name: "MongoDB", note: "Flexible document and event storage" },
      { name: "MySQL", note: "Established transactional workloads" },
      { name: "Redis", note: "Caching, queues and sessions" },
      { name: "Vector search", note: "Retrieval for AI features" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    description: "Repeatable deployments and no surprise outages.",
    icon: "cloud",
    items: [
      { name: "AWS", note: "Primary cloud platform" },
      { name: "Docker", note: "Reproducible build and runtime images" },
      { name: "CI/CD", note: "Automated test, build and release gates" },
      { name: "Terraform", note: "Infrastructure as code" },
      { name: "Observability", note: "Metrics, tracing and alerting" },
    ],
  },
];

/** Flat list for the scrolling marquee ticker. */
export const allTechnologyNames = techCategories.flatMap((category) =>
  category.items.map((item) => item.name),
);
