import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import type { TechCategory } from "@/data/technologies";

export interface TechStackCardProps {
  category: TechCategory;
  className?: string;
}

/**
 * One layer of the technology stack.
 *
 * Each technology carries a short note explaining its role. The note is shown on
 * hover *and* focus, and is always present in the DOM — so it is available to
 * screen readers and on touch devices, where hover never fires.
 */
export function TechStackCard({ category, className }: TechStackCardProps) {
  return (
    <Card as="article" interactive className={className}>
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-hover text-brand-soft">
          <Icon name={category.icon} size={19} />
        </span>
        <h3 className={cn(text.h4, "leading-tight")}>{category.label}</h3>
      </div>

      <p className="mb-6 text-sm text-subtle">{category.description}</p>

      <ul className="mt-auto flex flex-col gap-px overflow-hidden rounded-lg border border-border-subtle bg-border-subtle/60">
        {category.items.map((item) => (
          <li
            key={item.name}
            tabIndex={0}
            className="group/tech flex flex-col bg-surface px-4 py-3 transition-colors duration-200 hover:bg-surface-hover focus-visible:bg-surface-hover"
          >
            <span className="text-sm font-medium text-foreground">{item.name}</span>
            {/* Collapsed by default; grid-rows transition keeps it from jumping. */}
            <span className="grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-350 ease-out-expo group-hover/tech:grid-rows-[1fr] group-focus-visible/tech:grid-rows-[1fr] motion-reduce:grid-rows-[1fr]">
              <span className="min-h-0 pt-1 text-xs text-subtle">{item.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
