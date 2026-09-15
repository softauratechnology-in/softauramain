import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { faqGroups } from "@/data/faq";
import { routes } from "@/constants/navigation";
import { layout } from "@/styles/theme";

/**
 * The five questions people ask first — on the home page.
 *
 * The home page had no FAQ at all, which is a gap for the two readers this site
 * serves. A buyer weighing us up wants cost, timeline and ownership answered
 * before they click anything; an answer engine summarising the company reads
 * whatever prose is on the highest-authority page it can find, and that is this
 * one.
 *
 * Built on the existing `<Accordion>`, which is native `<details>`/`<summary>`
 * — so every answer is in the HTML whether or not it is open, and works with
 * JavaScript disabled.
 *
 * ## No `FAQPage` markup here, deliberately
 *
 * Google removed FAQ rich results entirely on 7 May 2026 (having restricted
 * them to government and health sites in August 2023), so the markup earns no
 * search feature for a business site either way. `/faq` still carries it, since
 * answer engines do read it and it costs nothing there. Emitting a *second*
 * copy of the same five answers on this page would duplicate that markup across
 * two URLs for no gain at all. The visible prose below is what does the work.
 */

/**
 * Selected by id rather than by slicing the first five.
 *
 * `faqGroups` is ordered for the /faq page, where the reader is browsing a
 * category at a time. Someone landing on the home page has a different first
 * question, and reordering that file would silently change what shows here.
 */
const FEATURED_IDS = [
  "cost",
  "how-long",
  "custom-erp-vs-off-the-shelf",
  "after-launch",
  "who-owns-it",
] as const;

const allItems = faqGroups.flatMap((group) => group.items);

const featured = FEATURED_IDS.map((id) =>
  allItems.find((item) => item.id === id),
).filter((item) => item !== undefined);

export function FaqTeaser() {
  /* If an id above is renamed in `data/faq.ts`, this renders what it can find
     rather than an empty accordion or a crash. */
  if (featured.length === 0) return null;

  return (
    <section className={layout.sectionY}>
      <Container>
        <SectionHeading
          eyebrow="Common questions"
          title="What people ask first"
          description="Cost, timelines and who owns what — answered plainly, before you have to ask."
          action={
            <Button href={routes.faq} variant="secondary" icon="arrowRight">
              All questions
            </Button>
          }
        />

        <Reveal>
          <Accordion items={featured} defaultOpenFirst className="max-w-3xl" />
        </Reveal>
      </Container>
    </section>
  );
}
