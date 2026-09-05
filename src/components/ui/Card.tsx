import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { tags, type PolymorphicTag } from "@/lib/polymorphic";

export interface CardProps {
  children: ReactNode;
  as?: PolymorphicTag;
  /**
   * `default` — flat surface with a hairline border.
   * `gradient` — gradient border, for featured cards.
   * `glass` — translucent, for cards sitting over the 3D canvas or imagery.
   */
  variant?: "default" | "gradient" | "glass";
  /** Adds the lift-and-glow hover treatment. Off for non-interactive cards. */
  interactive?: boolean;
  /** `false` removes the default padding — for cards with a full-bleed image. */
  padded?: boolean;
  className?: string;
}

const variants = {
  default: "bg-surface border border-border-subtle",
  /* Gradient border via layered backgrounds — see `.border-gradient` in globals.css. */
  gradient: "border-gradient",
  glass:
    "surface-glass backdrop-blur-[var(--glass-blur)] supports-[not(backdrop-filter:blur(0))]:bg-surface",
} as const;

/**
 * The shared card shell.
 *
 * Every card in the site (service, project, testimonial, feature, tech) composes
 * this, so radius, border colour and the hover lift are defined exactly once.
 * Card *content* layout is each specific card's business.
 */
export function Card({
  children,
  as,
  variant = "default",
  interactive = false,
  padded = true,
  className,
}: CardProps) {
  const Tag = tags[as ?? "div"];

  return (
    <Tag
      className={cn(
        "relative isolate flex h-full flex-col overflow-hidden rounded-card",
        variants[variant],
        padded && "p-6 sm:p-8",
        interactive &&
          "group/card transition-[transform,border-color,box-shadow,background-color] duration-350 ease-out-expo hover:-translate-y-1 hover:border-border-strong hover:bg-surface-hover hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
