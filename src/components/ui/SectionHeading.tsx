import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { layout } from "@/styles/theme";
import { Reveal } from "./Reveal";

export interface SectionHeadingProps {
  /** Uppercase label above the title. Keep it to two or three words. */
  eyebrow?: string;
  title: ReactNode;
  /** Supporting paragraph. Constrained to prose width for readability. */
  description?: string;
  /** `left` for content-heavy sections, `center` for statement sections. */
  align?: "left" | "center";
  /** Slot on the trailing edge — usually a CTA. Ignored when centred. */
  action?: ReactNode;
  className?: string;
}

/**
 * The heading block at the top of every section.
 *
 * Owns the eyebrow → title → description rhythm and the gap to the content
 * below it. Because every section uses it, changing `layout.headingGap` restyles
 * the whole page's vertical rhythm in one edit.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        layout.headingGap,
        centered
          ? "flex flex-col items-center text-center"
          : "flex flex-col gap-8 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <Reveal className={cn("flex flex-col", centered && "items-center")}>
        {eyebrow ? (
          <span className={cn(text.eyebrow, "mb-4 flex items-center gap-2.5")}>
            <span aria-hidden className="h-1 w-1 rounded-full bg-brand" />
            {eyebrow}
          </span>
        ) : null}

        <h2 className={cn(text.h2, "max-w-3xl text-balance")}>{title}</h2>

        {description ? (
          <p className={cn(text.lead, "mt-5 max-w-2xl text-pretty")}>{description}</p>
        ) : null}
      </Reveal>

      {action && !centered ? (
        <Reveal delay={0.15} className="shrink-0">
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}
