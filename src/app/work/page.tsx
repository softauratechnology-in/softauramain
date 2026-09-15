import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { WorkSection } from "@/sections/WorkSection";
import { CtaSection } from "@/sections/CtaSection";
import { Button } from "@/components/ui/Button";
import { primaryCta, routes } from "@/constants/navigation";

export const metadata: Metadata = pageMetadata({
  title: "Case studies",
  description:
    "Systems we have designed, built and handed over — including a school management ERP and a corporate web portal for a Dubai construction contractor.",
  path: routes.work,
});

/** Case-study index. */
export default function WorkPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Our work"
        title={[{ text: "Systems that" }, { text: "went live", accent: true }]}
        description="Every one of these replaced something held together by spreadsheets, paper and people remembering things. Here is what was wrong, what we built, and what changed."
        action={
          <Button href={primaryCta.href} icon="arrowRight">
            {primaryCta.label}
          </Button>
        }
      />

      <WorkSection />
      <CtaSection />
    </main>
  );
}
