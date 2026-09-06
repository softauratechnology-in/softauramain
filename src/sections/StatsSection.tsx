import { cn } from "@/lib/cn";
import { grotesk, text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { CountUp } from "@/components/ui/CountUp";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { stats } from "@/data/stats";
import { layout } from "@/styles/theme";

/**
 * The figures bar.
 *
 * A bento rather than an even six-across row: the first two tiles carry the
 * claims worth reading — how long we have been doing this, and where — so they
 * get the wide cells, and the remaining four sit as a quiet supporting grid.
 * An even row would give "7 steps in our process" the same weight as "4 years
 * building software", which is not the argument being made.
 *
 * Every number is derived — see `data/stats.ts` for why that is a deliberate
 * constraint rather than a placeholder.
 */
export function StatsSection() {
  if (stats.length === 0) return null;

  const [lead, second, ...rest] = stats;

  return (
    <section className={cn(layout.sectionY, "relative overflow-hidden")}>
      <div aria-hidden className="bg-brand-glow absolute inset-0 opacity-60" />

      <Container className="relative">
        {/* `auto-rows-fr` keeps the short tiles the same height as the tall
            ones, so the grid reads as a panel rather than a ragged stack. */}
        <RevealGroup className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[lead, second].map((stat) => (
            <RevealItem
              key={stat.id}
              variant="scaleIn"
              className="col-span-2 flex"
            >
              <StatTile stat={stat} featured />
            </RevealItem>
          ))}

          {rest.map((stat) => (
            <RevealItem key={stat.id} variant="scaleIn" className="flex">
              <StatTile stat={stat} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

function StatTile({
  stat,
  featured = false,
}: {
  stat: (typeof stats)[number];
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "surface-glass flex w-full flex-col rounded-card p-5 backdrop-blur-[var(--glass-blur)] sm:p-6",
        "supports-[not(backdrop-filter:blur(0))]:bg-surface",
        "transition-colors duration-350 ease-out-expo hover:bg-surface-hover",
      )}
    >
      <Icon
        name={stat.icon}
        size={featured ? 22 : 19}
        className="mb-4 text-brand-soft"
      />

      <p
        className={cn(
          featured ? grotesk.display : grotesk.h2,
          "leading-none text-foreground",
        )}
      >
        <CountUp value={stat.value} suffix={stat.suffix} />
      </p>

      <p className="mt-3 text-sm font-medium text-foreground">{stat.label}</p>
      <p className={cn(text.small, "mt-1")}>{stat.detail}</p>
    </div>
  );
}
