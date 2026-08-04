import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { tags, type PolymorphicTag } from "@/lib/polymorphic";
import { layout } from "@/styles/theme";

export interface ContainerProps
  extends Omit<HTMLAttributes<HTMLElement>, "className" | "children"> {
  children: ReactNode;
  /** Render as a different element — `section`, `header`, `footer`, etc. */
  as?: PolymorphicTag;
  /**
   * `default` for standard content, `wide` for large grids that should breathe,
   * `prose` for single-column reading width.
   */
  width?: "default" | "wide" | "prose";
  className?: string;
}

const widthClass = {
  default: layout.maxWidth,
  wide: layout.maxWidthWide,
  prose: layout.maxWidthProse,
} as const;

/**
 * The only place the page gutter and max-width are defined.
 *
 * Every section wraps its content in a `<Container>` so horizontal alignment is
 * identical down the whole page — including full-bleed sections, whose *inner*
 * text still uses one.
 */
export function Container({
  children,
  as,
  width = "default",
  className,
  /* Remaining props (aria-label, id, role…) pass through to the element — a
     `<Container as="nav">` still needs to be labelled. */
  ...rest
}: ContainerProps) {
  const Tag = tags[as ?? "div"];

  return (
    <Tag
      className={cn("mx-auto w-full", widthClass[width], layout.pageX, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
