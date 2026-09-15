import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { layout } from "@/styles/theme";
import { pageMetadata } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/sections/CtaSection";
import { articlesByDate } from "@/data/articles";
import { articlePath, routes } from "@/constants/navigation";

/**
 * `/insights` — the article index.
 *
 * Four pieces at launch, and a cadence of roughly one a fortnight after. The
 * reasoning for not publishing twenty at once is in `data/articles.ts`; it is a
 * spam-policy constraint rather than a capacity one.
 */

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description:
    "What custom software really costs, when to buy rather than build, and how to tell which you actually need. Written before you talk to a developer.",
  path: routes.insights,
});

export default function InsightsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: "Insights", path: routes.insights }])}
      />

      <main id="main">
        <PageHeader
          eyebrow="Insights"
          title={[
            { text: "What we tell people" },
            { text: "before they hire us", accent: true },
          ]}
          description="Written for the stage before anyone is ready to talk to a developer — what things cost, when the off-the-shelf product is the better answer, and how to tell what you are actually describing. Several of these will tell you not to commission anything."
        />

        <section className={layout.sectionY}>
          <Container>
            <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {articlesByDate.map((article) => (
                <RevealItem key={article.id} variant="scaleIn">
                  <Link href={articlePath(article.id)} className="block h-full">
                    <Card interactive className="flex h-full flex-col">
                      <span className={text.eyebrow}>
                        {new Date(article.published).toLocaleDateString(
                          "en-GB",
                          { month: "long", year: "numeric" },
                        )}
                      </span>
                      <h2 className={cn(grotesk.h4, "mt-4 text-pretty")}>
                        {article.title}
                      </h2>
                      <p className={cn(text.body, "mt-3 text-pretty")}>
                        {article.standfirst}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-soft">
                        Read
                        <Icon name="arrowRight" size={15} />
                      </span>
                    </Card>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>

        <CtaSection />
      </main>
    </>
  );
}
