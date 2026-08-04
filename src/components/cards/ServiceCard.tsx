import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import type { Service } from "@/data/services";

export interface ServiceCardProps {
  service: Service;
  /**
   * Featured cards get the gradient border and a two-column deliverables list.
   * Defaults to the service's own `featured` flag, but can be forced — e.g. when
   * rendering a condensed list where nothing should be emphasised.
   *
   * Note: grid *placement* (the column span) is the parent section's business,
   * not the card's — see `ServicesSection`.
   */
  featured?: boolean;
  className?: string;
}

/**
 * Service card.
 *
 * Deliverables are always rendered (not hidden behind hover) — hover-only content
 * is invisible on touch and to keyboard users, and this is the copy that actually
 * sells the service. The hover treatment is limited to the lift, icon tint and
 * the corner glow.
 */
export function ServiceCard({ service, featured, className }: ServiceCardProps) {
  const isFeatured = featured ?? service.featured ?? false;

  return (
    <Card
      as="article"
      variant={isFeatured ? "gradient" : "default"}
      interactive
      className={className}
    >
      {/* Corner bloom, revealed on hover. Decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover/card:opacity-100"
      />

      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border-subtle bg-surface-hover text-brand-soft transition-colors duration-350 group-hover/card:border-brand/40 group-hover/card:text-brand">
        <Icon name={service.icon} size={22} />
      </div>

      <h3 className={cn(text.h3, "mb-3 text-balance")}>{service.title}</h3>
      <p className={cn(text.body, "mb-6 text-pretty")}>{service.summary}</p>

      <ul
        className={cn(
          "mt-auto grid gap-2.5 border-t border-border-subtle pt-6",
          /* Featured cards are twice as wide, so their list reads better in two
             columns than as one very long column. */
          isFeatured && "sm:grid-cols-2 sm:gap-x-6",
        )}
      >
        {service.deliverables.map((deliverable) => (
          <li key={deliverable} className="flex items-start gap-2.5 text-sm text-subtle">
            <Icon name="check" size={16} className="mt-0.5 text-brand" />
            <span>{deliverable}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
