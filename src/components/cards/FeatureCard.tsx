import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Icon } from "@/components/ui/Icon";
import type { Differentiator } from "@/data/differentiators";

export interface FeatureCardProps {
  feature: Differentiator;
  /** Zero-based position — rendered as a hairline ordinal. */
  index: number;
  className?: string;
}

/**
 * "Why choose us" item.
 *
 * Borderless by design: this section is a bordered *grid*, with dividers drawn by
 * the parent, so each item only needs its own content. That reads as one
 * composed table rather than six floating boxes — a heavier visual than the
 * section warrants next to the service cards above it.
 */
export function FeatureCard({ feature, index, className }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group/feature relative flex flex-col p-7 transition-colors duration-350 hover:bg-surface/60 sm:p-9",
        className,
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle bg-surface text-brand-soft transition-colors duration-350 group-hover/feature:border-brand/40 group-hover/feature:text-brand">
          <Icon name={feature.icon} size={20} />
        </span>
        <span className={cn(text.ordinal, "text-subtle/50")} aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className={cn(text.h4, "mb-3 text-balance")}>{feature.title}</h3>
      <p className="text-pretty text-sm leading-relaxed text-muted">
        {feature.description}
      </p>
    </article>
  );
}
