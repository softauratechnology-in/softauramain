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
 * Two layouts, **one DOM tree**.
 *
 * Below `lg` it is a timeline row: ordinal marker in a rail on the left,
 * content on the right, connector line drawn between markers. From `lg` up it
 * becomes a self-contained glass card in a two-column grid — the connector is
 * dropped, the marker moves inline above the title, and the sequence is carried
 * by the ordinals alone. Seven full-width rows in a single column is a long
 * scroll of prose whatever is in it; the same seven as cards is a diagram.
 *
 * Rendering two markups and toggling with `hidden`/`lg:block` would have been
 * easier and is why this is worth a note: it would put every word on the page
 * twice, which a screen reader reads twice and a search engine counts twice.
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
    <div
      className={cn(
        "group/step relative flex gap-6 sm:gap-10",
        /* From `lg` the row becomes a card: stack the marker over the content,
           and take the glass treatment. Every one of these is a Tailwind
           utility with a working `lg:` variant — `surface-glass` included,
           which is why it is registered with `@utility` in globals.css. */
        "lg:h-full lg:w-full lg:flex-col lg:gap-0 lg:rounded-card lg:p-6",
        "lg:surface-glass lg:backdrop-blur-[var(--glass-blur)]",
        "lg:supports-[not(backdrop-filter:blur(0))]:bg-surface",
        "lg:transition-colors lg:duration-350 lg:ease-out-expo lg:hover:bg-surface-hover",
        className,
      )}
    >
      {/* Marker rail */}
      <div className="relative flex flex-col items-center lg:mb-5 lg:items-start">
        <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-brand-soft transition-colors duration-350 group-hover/step:border-brand group-hover/step:bg-brand group-hover/step:text-white lg:h-11 lg:w-11 lg:rounded-xl">
          <Icon name={step.icon} size={20} />
        </span>
        {/* The connector belongs to the timeline only — in a grid it would draw
            a line to whichever card happened to land underneath. */}
        {!isLast ? (
          <span
            aria-hidden
            className="w-px flex-1 bg-gradient-to-b from-border-strong to-border-subtle lg:hidden"
          />
        ) : null}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1",
          isLast ? "pb-0" : "pb-12 sm:pb-16",
          "lg:flex lg:flex-col lg:pb-0",
        )}
      >
        <div className="mb-2.5 flex flex-wrap items-center gap-3">
          <span className={cn(text.ordinal, "text-brand")} aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className={cn(text.h4, "leading-tight")}>{step.title}</h3>
          <Tag>{step.duration}</Tag>
        </div>

        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted sm:text-base lg:text-sm">
          {step.description}
        </p>

        <p className="mt-3.5 flex items-center gap-2 text-xs text-subtle lg:mt-auto lg:pt-4">
          <Icon name="check" size={14} className="shrink-0 text-brand" />
          <span>
            <span className="text-subtle/70">You receive: </span>
            {step.output}
          </span>
        </p>
      </div>
    </div>
  );
}
