import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TagList } from "@/components/ui/Tag";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/sections/CtaSection";
import { projects, getProject } from "@/data/projects";
import { caseStudyPath, primaryCta, routes } from "@/constants/navigation";
import { site } from "@/constants/site";
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

  const socialTitle = `${project.title} — ${site.name}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: caseStudyPath(project.id) },
    openGraph: {
      type: "article",
      url: caseStudyPath(project.id),
      siteName: site.name,
      title: socialTitle,
      description: project.summary,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
    /* Twitter is a separate namespace — Next does not copy `openGraph` into it.
       Without this block the card falls back to the root layout's site-wide
       title, so every case study shared on X looked like the homepage. */
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: project.summary,
      images: [project.image],
    },
  };
}

/**
 * The three chapters every case study is told in.
 *
 * The scaffolding — heading, icon, standing description — is fixed here rather
 * than per project, because it is our framing and not a claim about any client.
 * Only the `points` come from the project data.
 */
const CHAPTERS = [
  {
    id: "problem",
    heading: "The problem",
    icon: "search",
    lead: "What the business was dealing with before we started.",
  },
  {
    id: "approach",
    heading: "What we built",
    icon: "blueprint",
    lead: "The system we designed and delivered.",
  },
  {
    id: "outcome",
    heading: "What changed",
    icon: "check",
    lead: "How the work landed in day-to-day operation.",
  },
] as const satisfies readonly {
  id: string;
  heading: string;
  icon: IconName;
  lead: string;
}[];

/**
 * One chapter of a case study.
 *
 * Each point gets its own panel rather than a bullet in a list. The content is
 * identical — the words are the client-approved copy, unedited — but thirty
 * consecutive full-sentence bullets in a single reading column is the shape of
 * a report, and no amount of good writing rescues that shape. Discrete panels
 * let a reader take one point at a time and leave when they have enough, which
 * is how these pages are actually read.
 *
 * The heading column sticks on `lg`, so the reader always knows which of the
 * three questions the panel beside them is answering.
 */
function Chapter({
  chapter,
  step,
  points,
}: {
  chapter: (typeof CHAPTERS)[number];
  step: number;
  points: string[];
}) {
  return (
    <section
      id={chapter.id}
      data-anchor
      className="grid gap-8 lg:grid-cols-12 lg:gap-12"
    >
      <div className="lg:col-span-4">
        <Reveal className="lg:sticky lg:top-[calc(var(--nav-height)+2.5rem)]">
          <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle bg-surface text-brand-soft">
            <Icon name={chapter.icon} size={20} />
          </span>

          <span className={cn(text.ordinal, "block text-subtle")}>
            {String(step).padStart(2, "0")}
          </span>
          <h2 className={cn(text.h3, "mt-1 text-balance")}>{chapter.heading}</h2>
          <p className="mt-3 text-sm text-subtle">{chapter.lead}</p>
        </Reveal>
      </div>

      <RevealGroup
        as="ul"
        className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:col-span-8"
      >
        {points.map((point, index) => (
          <RevealItem as="li" key={point} variant="scaleIn" className="flex">
            <div className="surface-glass flex w-full flex-col rounded-card p-5 backdrop-blur-[var(--glass-blur)] transition-colors duration-350 ease-out-expo hover:bg-surface-hover supports-[not(backdrop-filter:blur(0))]:bg-surface sm:p-6">
              <span
                aria-hidden
                className={cn(
                  text.ordinal,
                  "mb-3 text-brand-soft/70",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-pretty text-sm leading-relaxed text-muted">
                {point}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);

  if (!project) notFound();

  /* Wraps around, so the last case study still offers somewhere to go next. */
  const index = projects.findIndex((entry) => entry.id === project.id);
  const next = projects[(index + 1) % projects.length];

  /* Breadcrumbs. The one schema gap that changes what a searcher actually
     sees: Google renders this as the path above the result instead of a bare
     URL. `@id` points at the site-wide graph in `layout.tsx` rather than
     restating the organisation. */
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Case studies",
        item: `${site.url}${routes.work}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${site.url}${caseStudyPath(project.id)}`,
      },
    ],
  };

  return (
    <main id="main">
      {/* Same `<` escape as every other JSON-LD block on the site — project
          titles are content, and content can contain markup. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />

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

        {/* Glass tiles rather than a bordered row. This strip is the first
            thing under the hero image and sets the register for everything
            below it — as three columns divided by rules it read as a table of
            contents; as panels it reads as a summary card. */}
        <dl className="mt-8 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { term: "Client", icon: "users", value: project.client },
            { term: "Type of work", icon: "layers", value: project.category },
          ].map((entry) => (
            <div
              key={entry.term}
              className="surface-glass rounded-card p-5 backdrop-blur-[var(--glass-blur)] supports-[not(backdrop-filter:blur(0))]:bg-surface"
            >
              <dt className={cn(text.eyebrow, "flex items-center gap-2")}>
                <Icon
                  name={entry.icon as IconName}
                  size={15}
                  className="text-brand-soft"
                />
                {entry.term}
              </dt>
              <dd className="mt-2.5 font-medium text-foreground">{entry.value}</dd>
            </div>
          ))}

          <div className="surface-glass rounded-card p-5 backdrop-blur-[var(--glass-blur)] supports-[not(backdrop-filter:blur(0))]:bg-surface">
            <dt className={cn(text.eyebrow, "flex items-center gap-2")}>
              <Icon name="sparkle" size={15} className="text-brand-soft" />
              Focus
            </dt>
            <dd className="mt-2.5">
              <TagList tags={project.stack ?? project.tags} max={4} />
            </dd>
          </div>
        </dl>
      </Container>

      <section className={layout.sectionY}>
        <Container>
          <div className="flex flex-col gap-16 lg:gap-24">
            {[project.challenge, project.approach, project.outcome].map(
              (points, index) => (
                <Chapter
                  key={CHAPTERS[index].id}
                  chapter={CHAPTERS[index]}
                  step={index + 1}
                  points={points}
                />
              ),
            )}
          </div>

          {/* Said plainly rather than dressed up as a metric. The rest of the
              site argues that we do not invent numbers; this is where that
              claim is most tempting to break. */}
          <p className="mt-16 max-w-3xl border-l-2 border-border-strong pl-5 text-sm text-subtle">
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
