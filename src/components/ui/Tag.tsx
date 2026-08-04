import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TagProps {
  children: ReactNode;
  /**
   * `default` for technology/domain tags, `brand` to highlight one tag in a set,
   * `outline` for tags on top of imagery.
   */
  variant?: "default" | "brand" | "outline";
  className?: string;
}

const variants = {
  default: "bg-surface-hover text-muted border-border-subtle",
  brand: "bg-brand/12 text-brand-soft border-brand/30",
  outline: "bg-transparent text-foreground/80 border-foreground/20",
} as const;

/** Small pill label — technology tags, project categories, durations. */
export function Tag({ children, variant = "default", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide whitespace-nowrap",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface TagListProps {
  tags: readonly string[];
  variant?: TagProps["variant"];
  /** Caps the visible count and appends a "+N" pill. `0` shows all. */
  max?: number;
  className?: string;
}

/**
 * A row of tags.
 *
 * `max` keeps long tag arrays from wrapping a card into a different height than
 * its neighbours, which is what breaks grid alignment.
 */
export function TagList({ tags, variant, max = 0, className }: TagListProps) {
  const visible = max > 0 ? tags.slice(0, max) : tags;
  const overflow = tags.length - visible.length;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((tag) => (
        <li key={tag}>
          <Tag variant={variant}>{tag}</Tag>
        </li>
      ))}
      {overflow > 0 ? (
        <li>
          <Tag variant={variant}>{`+${overflow}`}</Tag>
        </li>
      ) : null}
    </ul>
  );
}
