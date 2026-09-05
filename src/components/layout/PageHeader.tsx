import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedHeadline, type HeadlineSegment } from "@/components/ui/AnimatedHeadline";

/**
 * Interior page header.
 *
 * The home page opens with a full-height hero; every other route opens with
 * this. It exists mainly to solve a layout problem: the navbar is `fixed`, so
 * without dedicated top padding the first heading on a page sits underneath it.
 *
 * Kept deliberately quieter than the hero — one animated headline, no floating
 * panels — so arriving on `/services` does not feel like arriving on a second
 * home page.
 */

export interface PageHeaderProps {
  eyebrow: string;
  /** Segments, so one phrase can carry the brand gradient. */
  title: HeadlineSegment[];
  description?: string;
  /** Buttons or links under the description. */
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        /* Only a token of bottom padding: whatever section follows brings its
           own generous `layout.sectionY` top padding, and stacking both leaves
           most of a screen empty between the header and the first content. */
        "relative overflow-hidden pt-[calc(var(--nav-height)+3.5rem)] pb-2 sm:pb-4",
        className,
      )}
    >
      <div aria-hidden className="bg-grid absolute inset-0 opacity-30" />
      <div aria-hidden className="bg-brand-glow absolute inset-0" />

      <Container className="relative">
        <div className="max-w-3xl">
          <Reveal variant="fadeDown">
            <span className={text.eyebrow}>{eyebrow}</span>
          </Reveal>

          <AnimatedHeadline
            segments={title}
            delay={0.06}
            className={cn(grotesk.h2, "mt-6 text-balance")}
          />

          {description ? (
            <Reveal delay={0.3}>
              <p className={cn(text.lead, "mt-6 max-w-2xl text-pretty text-muted")}>
                {description}
              </p>
            </Reveal>
          ) : null}

          {action ? (
            <Reveal delay={0.38}>
              <div className="mt-9 flex flex-wrap items-center gap-4">{action}</div>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
