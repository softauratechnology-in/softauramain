import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import type { ProcessStep } from "@/data/process";

export interface ProcessStepCardProps {
  step: ProcessStep;
  index: number;
  /** Hides the connector line on the last step. */
  isLast?: boolean;
  className?: string;
}

/**
 * One step in the delivery timeline.
 *
 * Laid out as a timeline row: ordinal marker in a rail on the left, content on
 * the right, with a connector line drawn between markers. The connector is a
 * pseudo-element on the marker column rather than a separate element, so the
 * markup stays a flat list and the line always ends exactly at the next marker.
 *
 * Renders a plain `<div>`, not an `<li>`: the parent section wraps each step in a
 * reveal element which becomes the `<li>`, and `<ol> > <div> > <li>` is invalid
 * markup. List semantics belong to whoever owns the `<ol>`.
 */
export function ProcessStepCard({
  step,
  index,
  isLast = false,
  className,
}: ProcessStepCardProps) {
  return (
    <div className={cn("group/step relative flex gap-6 sm:gap-10", className)}>
      {/* Marker rail */}
      <div className="relative flex flex-col items-center">
        <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-brand-soft transition-colors duration-350 group-hover/step:border-brand group-hover/step:bg-brand group-hover/step:text-white">
          <Icon name={step.icon} size={20} />
        </span>
        {!isLast ? (
          <span
            aria-hidden
            className="w-px flex-1 bg-gradient-to-b from-border-strong to-border-subtle"
          />
        ) : null}
      </div>

      {/* Content */}
      <div className={cn("flex-1", isLast ? "pb-0" : "pb-12 sm:pb-16")}>
        <div className="mb-2.5 flex flex-wrap items-center gap-3">
          <span className={cn(text.ordinal, "text-brand")} aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className={cn(text.h4, "leading-tight")}>{step.title}</h3>
          <Tag>{step.duration}</Tag>
        </div>

        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted sm:text-base">
          {step.description}
        </p>

        <p className="mt-3.5 flex items-center gap-2 text-xs text-subtle">
          <Icon name="check" size={14} className="text-brand" />
          <span>
            <span className="text-subtle/70">You receive: </span>
            {step.output}
          </span>
        </p>
      </div>
    </div>
  );
}
