import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TagList } from "@/components/ui/Tag";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/sections/CtaSection";
import { projects, getProject } from "@/data/projects";
import { caseStudyPath, primaryCta, routes } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * Case-study detail page.
 *
 * Statically generated: `generateStaticParams` enumerates every case study at
 * build time, so these are plain HTML at request time with no data fetching.
 *
 * `PageProps<'/work/[slug]'>` is Next.js's generated route-props helper — it is
 * globally available (no import) and derives `params` from the route's actual
 * folder structure, so renaming the `[slug]` segment becomes a type error here
 * rather than a runtime surprise.
 */

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: caseStudyPath(project.id) },
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
  };
}

/** One narrative block. Three of these carry the whole case study. */
function Narrative({
  heading,
  points,
}: {
  heading: string;
  points: string[];
}) {
  return (
    <div>
      <h2 className={cn(text.h3, "text-balance")}>{heading}</h2>
      <RevealGroup as="ul" className="mt-6 space-y-4">
        {points.map((point) => (
          <RevealItem
            as="li"
            key={point}
            className="flex gap-3.5 text-pretty text-muted"
          >
            <span
              aria-hidden
              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
            />
            {point}
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);

  if (!project) notFound();

  /* Wraps around, so the last case study still offers somewhere to go next. */
  const index = projects.findIndex((entry) => entry.id === project.id);
  const next = projects[(index + 1) % projects.length];

  return (
    <main id="main">
      <PageHeader
        eyebrow={project.category}
        title={[{ text: project.title }]}
        description={project.summary}
        action={
          <Button href={primaryCta.href} icon="arrowRight">
            {primaryCta.label}
          </Button>
        }
      />

      <Container>
        <Reveal variant="scaleIn">
          <div className="relative aspect-[16/9] overflow-hidden rounded-card ring-hairline">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(min-width: 1280px) 1152px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </Reveal>

        <dl className="mt-10 grid grid-cols-1 gap-8 border-y border-border-subtle py-8 sm:grid-cols-3">
          <div>
            <dt className={text.eyebrow}>Client</dt>
            <dd className="mt-2 text-foreground">{project.client}</dd>
          </div>
          <div>
            <dt className={text.eyebrow}>Type of work</dt>
            <dd className="mt-2 text-foreground">{project.category}</dd>
          </div>
          <div>
            <dt className={text.eyebrow}>Focus</dt>
            <dd className="mt-2">
              <TagList tags={project.stack ?? project.tags} max={4} />
            </dd>
          </div>
        </dl>
      </Container>

      <section className={layout.sectionY}>
        {/* Left-aligned reading column rather than `width="prose"`, which
            centres — the narrative has to line up with the page heading. */}
        <Container>
          <div className="max-w-3xl space-y-16">
            <Narrative heading="The problem" points={project.challenge} />
            <Narrative heading="What we built" points={project.approach} />
            <Narrative heading="What changed" points={project.outcome} />
          </div>

          {/* Said plainly rather than dressed up as a metric. The rest of the
              site argues that we do not invent numbers; this is where that
              claim is most tempting to break. */}
          <p className="mt-14 max-w-3xl border-l-2 border-border-strong pl-5 text-sm text-subtle">
            We do not publish performance figures for client systems unless the
            client has measured them and agreed to us quoting them. If you would
            like to talk to a reference, ask and we will arrange it.
          </p>
        </Container>
      </section>

      <Container>
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border-subtle pt-10">
          <Link
            href={routes.work}
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
          >
            <Icon name="arrowRight" size={16} className="rotate-180" />
            All case studies
          </Link>

          {next.id !== project.id ? (
            <Link
              href={caseStudyPath(next.id)}
              className="group/next inline-flex items-center gap-2 text-sm font-medium text-brand-strong transition-colors duration-200 hover:text-foreground"
            >
              Next: {next.title}
              <Icon
                name="arrowRight"
                size={16}
                className="transition-transform duration-350 ease-out-expo group-hover/next:translate-x-1"
              />
            </Link>
          ) : null}
        </div>
      </Container>

      <CtaSection />
    </main>
  );
}
