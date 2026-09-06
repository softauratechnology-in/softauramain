import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { differentiators } from "@/data/differentiators";
import { SECTION_IDS } from "@/constants/navigation";
import { site } from "@/constants/site";
import { layout } from "@/styles/theme";
import { cn } from "@/lib/cn";

/**
 * Column spans on the `lg` bento, keyed by differentiator id.
 *
 * A six-column track split 2|4 / 4|2 / 3|3. The wide cells are not arbitrary:
 * `modern-stack` and `scalable-architecture` carry 48 and 47 words against a
 * 32–39 word average, so on an even three-across grid they set the height of
 * their whole row and leave their neighbours half empty. Giving the long copy
 * the wide cells costs it two lines and squares the rows up.
 *
 * Keyed by id rather than index so reordering the data cannot silently hand
 * the wide cell to a one-line entry. Anything unlisted falls back to a third.
 */
const SPANS: Record<string, string> = {
  "senior-team": "lg:col-span-2",
  "modern-stack": "lg:col-span-4",
  "scalable-architecture": "lg:col-span-4",
  "agile-delivery": "lg:col-span-2",
  "security-first": "lg:col-span-3",
  "long-term-support": "lg:col-span-3",
};

/**
 * "Why choose us".
 *
 * Rendered as one bordered table rather than six separate cards. The dividers are
 * drawn with `gap-px` over a border-coloured background — the classic trick that
 * gives perfect 1px internal rules with no double borders at the seams and no
 * `:last-child` exceptions to maintain.
 */
export function WhyUsSection() {
  return (
    <section
      id={SECTION_IDS.whyUs}
      className={`${layout.sectionY} border-y border-border-subtle bg-surface/30`}
    >
      <Container>
        <SectionHeading
          eyebrow={`Why ${site.shortName}`}
          title="Built to be a long-term engineering partner"
          description="Most vendor relationships fail on the things nobody put in the proposal. These are the commitments we make explicit up front."
        />

        <RevealGroup className="grid auto-rows-fr grid-cols-1 gap-px overflow-hidden rounded-card border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-6">
          {/* Opacity-only, deliberately. The cells are opaque and sit on a
              border-coloured parent with `gap-px` drawing the rules between
              them, so the default `fadeUp` slid each cell off its own grid
              track on entry and flashed a 28px band of border colour behind it.
              Nothing else in this grid can move for the same reason. */}
          {differentiators.map((feature, index) => (
            <RevealItem
              key={feature.id}
              variant="fadeIn"
              className={cn("bg-background", SPANS[feature.id] ?? "lg:col-span-2")}
            >
              <FeatureCard feature={feature} index={index} className="h-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
