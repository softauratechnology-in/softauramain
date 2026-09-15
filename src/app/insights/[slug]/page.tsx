import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { layout } from "@/styles/theme";
import { pageMetadata } from "@/lib/pageMetadata";
import { headlineSegments } from "@/lib/headline";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/sections/CtaSection";
import { articles, getArticle } from "@/data/articles";
import { findLandingPage } from "@/data/landingPages";
import { articlePath, landingPath, routes } from "@/constants/navigation";

/**
 * Article detail.
 *
 * The prose is the product here, so the page is deliberately plain: one column,
 * generous measure, no panels competing with the text. The only decoration is
 * the page header these pages share with the rest of the site.
 */

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.id }));
}

export async function generateMetadata(
  props: PageProps<"/insights/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);

  if (!article) return {};

  return pageMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: articlePath(article.id),
  });
}

export default async function ArticlePage(
  props: PageProps<"/insights/[slug]">,
) {
  const { slug } = await props.params;
  const article = getArticle(slug);

  if (!article) notFound();

  const siblings = article.related
    .map((id) => findLandingPage(id))
    .filter((page) => page !== undefined);

  const published = new Date(article.published).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: article.h1,
          description: article.metaDescription,
          path: articlePath(article.id),
          published: article.published,
          updated: article.updated,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Insights", path: routes.insights },
          { name: article.title, path: articlePath(article.id) },
        ])}
      />

      <main id="main">
        <PageHeader
          eyebrow="Insights"
          title={headlineSegments(article.h1, article.h1Accent)}
          description={article.standfirst}
        />

        <article className={layout.sectionY}>
          <Container>
            <div className="max-w-2xl">
              <Reveal>
                <p className={cn(text.small, "border-b border-border-subtle pb-6")}>
                  Published {published}
                  {article.updated ? " · Updated since" : ""}
                </p>
              </Reveal>

              {article.sections.map((section) => (
                <Reveal key={section.heading} className="mt-12">
                  <h2 className={cn(grotesk.h3, "text-balance")}>
                    {section.heading}
                  </h2>

                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className={cn(text.body, "mt-5 text-pretty")}
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.list ? (
                    <ul className="mt-6 flex flex-col gap-3.5">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <Icon
                            name="check"
                            size={17}
                            className="mt-1 shrink-0 text-brand-soft"
                          />
                          <span className={cn(text.body, "text-pretty")}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Reveal>
              ))}

              <Reveal className="mt-14">
                <Button href={routes.contact} icon="arrowRight">
                  Talk to us about your project
                </Button>
              </Reveal>
            </div>
          </Container>
        </article>

        {siblings.length > 0 ? (
          <section className={layout.sectionY}>
            <Container>
              <SectionHeading eyebrow="Related" title="What we build" />

              <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {siblings.map((sibling) => (
                  <RevealItem key={sibling.id} variant="scaleIn">
                    <Link
                      href={landingPath(sibling.section, sibling.id)}
                      className="block h-full"
                    >
                      <Card interactive className="h-full">
                        <Icon
                          name={sibling.icon}
                          size={22}
                          className="text-brand-soft"
                        />
                        <h3 className={cn(grotesk.h4, "mt-5 text-pretty")}>
                          {sibling.title}
                        </h3>
                        <p className={cn(text.small, "mt-3 text-pretty")}>
                          {sibling.summary}
                        </p>
                      </Card>
                    </Link>
                  </RevealItem>
                ))}
              </RevealGroup>
            </Container>
          </section>
        ) : null}

        <CtaSection />
      </main>
    </>
  );
}
