import Image from "next/image";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import type { Testimonial } from "@/data/testimonials";

export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

/** First letters of the first two words — the avatar fallback. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/**
 * Testimonial card.
 *
 * Marked up as a real `<blockquote>` + `<figcaption>` rather than styled divs, so
 * the attribution is programmatically tied to the quote. The avatar is optional
 * and falls back to initials — no broken image frames when a client declines to
 * supply a headshot.
 */
export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <Card as="figure" interactive className={cn("justify-between", className)}>
      <Icon
        name="quote"
        size={28}
        className="mb-5 text-brand/40 transition-colors duration-350 group-hover/card:text-brand/70"
      />

      <blockquote className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
        {testimonial.quote}
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-3.5 border-t border-border-subtle pt-6">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-hover text-sm font-semibold text-brand-soft"
          >
            {initials(testimonial.author)}
          </span>
        )}

        <span className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {testimonial.author}
          </span>
          <span className="text-xs text-subtle">
            {testimonial.role}, {testimonial.company}
          </span>
        </span>
      </figcaption>
    </Card>
  );
}
