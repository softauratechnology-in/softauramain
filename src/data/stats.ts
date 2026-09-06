import type { IconName } from "@/components/ui/Icon";
import { site, contact } from "@/constants/site";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { processSteps } from "@/data/process";
import { allTechnologyNames } from "@/data/technologies";

export interface Stat {
  id: string;
  /** The number itself. Animated from zero when the tile scrolls into view. */
  value: number;
  /** Appended verbatim after the number — "+", "%", nothing. */
  suffix?: string;
  /** Short label under the figure. */
  label: string;
  /** One line of context, so the figure is not left to speak for itself. */
  detail: string;
  icon: IconName;
}

/**
 * Headline figures.
 *
 * **Every value here is computed, not typed.** They are counts of things this
 * repository already contains, or arithmetic on the founding year — so they
 * cannot be wrong, and they cannot drift when a service or case study is added.
 * Adding a fourth project moves the number on the page by itself.
 *
 * That constraint is the point rather than a limitation. This site argues in
 * four separate files that it does not publish figures it has not verified —
 * `HeroSection` says so about the hero list, `projects.ts` says so about
 * outcomes, and `/work/[slug]` prints a standing disclaimer about performance
 * metrics. A "50+ projects delivered" tile sitting above that disclaimer would
 * undo all of it.
 *
 * If a genuinely measured figure becomes available — headcount, a client count
 * someone has actually counted — it belongs here as a plain literal with a
 * comment recording where it came from and who confirmed it.
 */

/** Whole years since founding. Recomputed per render on the server. */
function yearsInOperation(): number {
  return new Date().getFullYear() - site.foundedYear;
}

export const stats: Stat[] = [
  {
    id: "years",
    value: yearsInOperation(),
    suffix: "+",
    label: "Years building software",
    detail: `Delivering since ${site.foundedYear}.`,
    icon: "rocket",
  },
  {
    id: "regions",
    value: contact.regions.length,
    label: "Regions served",
    detail: contact.regions.join(" and ") + ".",
    icon: "globe",
  },
  {
    id: "services",
    value: services.length,
    label: "Services offered",
    detail: "From custom ERP to cloud and support.",
    icon: "layers",
  },
  {
    id: "technologies",
    value: allTechnologyNames.length,
    label: "Technologies in use",
    detail: "Chosen per project, not per fashion.",
    icon: "code",
  },
  {
    id: "projects",
    value: projects.length,
    label: "Case studies published",
    detail: "Real engagements, written up in full.",
    icon: "browser",
  },
  {
    id: "process",
    value: processSteps.length,
    label: "Steps in our process",
    detail: "Every one of them agreed before we start.",
    icon: "blueprint",
  },
];
