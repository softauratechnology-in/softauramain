import Image from "next/image";
import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { TagList } from "@/components/ui/Tag";
import { HoverVideo } from "@/components/ui/HoverVideo";
import type { Project } from "@/data/projects";

export interface ProjectCardProps {
  project: Project;
  /** Featured cards span the full grid width with a side-by-side layout. */
  featured?: boolean;
  /**
   * `true` for the first card or two in the grid — sets `priority` on the image
   * so above-the-fold artwork is not lazy-loaded.
   */
  priority?: boolean;
  className?: string;
}

/**
 * Case-study card.
 *
 * The whole card is *not* a single link: the "View project" action is a discrete
 * link so the card stays readable to screen readers, and the card gracefully
 * degrades to non-interactive when a project has no public URL — which is the
 * common case for enterprise work under NDA.
 */
export function ProjectCard({
  project,
  featured,
  priority = false,
  className,
}: ProjectCardProps) {
  const isFeatured = featured ?? project.featured ?? false;
  const tags = project.stack ?? project.tags;

  return (
    <Card
      as="article"
      interactive
      padded={false}
      className={cn(
        isFeatured && "lg:col-span-2 lg:flex-row",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-surface-hover",
          isFeatured ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/10]",
        )}
      >
        {/* The still is the baseline; a clip, where one exists, layers over it
            on hover only. */}
        <HoverVideo src={project.video} poster={project.image}>
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            /* Two-up grid above `lg`, full width below — tells the optimiser which
               candidate to pick instead of always serving the largest. */
            sizes={
              isFeatured
                ? "(min-width: 1024px) 50vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
            priority={priority}
            /* No hover zoom: scaling the image inside a fixed frame crops it on
               hover and makes the whole grid feel like it is breathing while the
               pointer crosses it. The overlay and link handle the affordance. */
            className="object-cover"
          />
        </HoverVideo>
        {/* Keeps the eyebrow legible over any artwork. `pointer-events-none` on
            both: they sit above the media and would otherwise swallow the
            hover that starts the clip. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent"
        />
        <span
          className={cn(
            text.eyebrow,
            "pointer-events-none absolute bottom-4 left-5 text-foreground/80",
          )}
        >
          {project.category}
        </span>
      </div>

      <div className={cn("flex flex-1 flex-col p-6 sm:p-8", isFeatured && "lg:justify-center")}>
        <h3 className={cn(text.h3, "text-balance")}>{project.title}</h3>
        <p className="mt-1.5 text-sm text-subtle">{project.client}</p>
        <p className={cn(text.body, "mt-4 text-pretty")}>{project.description}</p>

        <TagList tags={tags} max={4} className="mt-6" />

        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="hover"
            className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-brand-soft transition-colors duration-200 hover:text-foreground"
          >
            View project
            <Icon
              name="arrowUpRight"
              size={16}
              className="transition-transform duration-350 ease-out-expo group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
            />
          </a>
        ) : (
          /* No public link — say so plainly rather than rendering a dead button. */
          <p className="mt-6 text-xs tracking-wide text-subtle/70 uppercase">
            Private engagement — details on request
          </p>
        )}
      </div>
    </Card>
  );
}
