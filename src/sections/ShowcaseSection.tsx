import Image from "next/image";
import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { featuredProject } from "@/data/projects";

/**
 * Full-bleed featured panel.
 *
 * Previously this widened from 82% to 100% and lost its corner radius on a
 * scroll-scrubbed tween. That was removed: `width` and `border-radius` are not
 * compositable, so every scroll frame forced layout + paint across a
 * viewport-sized image — the most expensive thing on the page, and the reason
 * scrolling past this section felt heavy and rubbery rather than native.
 *
 * The framed look it animated *from* is kept — 82% wide with a soft radius — as
 * a fixed style. That was the intended composition; only the per-frame animating
 * of it is gone. Scrolling here is now plain browser scrolling: no scrub, no pin,
 * no hijack, nothing on the scroll path at all. Section entrance motion, where it
 * is wanted, belongs in `<Reveal>` — IntersectionObserver-driven, fires once.
 *
 * Dropping the tween also drops the `"use client"` boundary: this is a Server
 * Component again, so none of it ships as JS.
 *
 * Renders nothing without a featured project, rather than an empty frame.
 */
export function ShowcaseSection() {
  if (!featuredProject) return null;

  return (
    <section className="overflow-hidden py-20 sm:py-28">
      <div className="relative mx-auto aspect-[16/9] w-[82%] overflow-hidden rounded-[1.75rem] bg-surface">
        <Image
          src={featuredProject.image}
          alt={featuredProject.imageAlt}
          fill
          sizes="82vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
        />

        <Container className="absolute inset-x-0 bottom-0 pb-8 sm:pb-14">
          <p className={cn(text.eyebrow, "mb-3")}>{featuredProject.category}</p>
          <h2 className={cn(text.h2, "max-w-3xl text-balance")}>
            {featuredProject.title}
          </h2>
        </Container>
      </div>
    </section>
  );
}
