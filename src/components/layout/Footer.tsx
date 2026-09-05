import Link from "next/link";
import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Wordmark } from "@/components/ui/Wordmark";
import { footerNav, primaryCta, routes } from "@/constants/navigation";
import {
  activeSocials,
  contact,
  site,
  whatsappLinks,
} from "@/constants/site";

/**
 * Site footer, with the closing CTA.
 *
 * The oversized circular "Start a project" button is carried over from the demo's
 * design language — it is the single strongest conversion element on the page and
 * the visual signature of the layout, so it stays.
 *
 * A Server Component: nothing here needs interactivity. The copyright year is
 * computed at build/request time on the server, which avoids the hydration
 * mismatch a client-side `new Date()` can cause across timezone boundaries.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightRange =
    currentYear > site.foundedYear
      ? `${site.foundedYear}–${currentYear}`
      : `${currentYear}`;

  return (
    <footer className="relative overflow-hidden border-t border-border-subtle bg-surface">
      {/* Brand bloom behind the CTA. Decorative. */}
      <div aria-hidden className="bg-brand-glow absolute inset-x-0 top-0 h-96" />

      {/* Closing CTA */}
      <Container className="relative flex flex-col items-center gap-10 py-24 text-center sm:gap-14 sm:py-32">
        <Reveal className="flex flex-col items-center">
          <span className={cn(text.eyebrow, "mb-5")}>Let&rsquo;s build something</span>
          <h2 className={cn(text.display, "max-w-4xl text-balance")}>
            Have a product in mind?
          </h2>
          <p className={cn(text.lead, "mt-6 max-w-xl text-pretty")}>
            Tell us what you are trying to build. We will come back with an honest
            view on scope, timeline and cost — usually {contact.responseTime}.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Link
            href={primaryCta.href}
            data-cursor="hover"
            className="flex h-44 w-44 items-center justify-center rounded-full border border-foreground/20 px-8 text-center font-display text-base font-bold tracking-tight transition-all duration-500 ease-out-expo hover:border-transparent hover:bg-foreground hover:text-background sm:h-52 sm:w-52 sm:text-lg"
          >
            Start a project
          </Link>
        </Reveal>
      </Container>

      <div className="divider-fade" />

      {/* Sitemap + contact */}
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href={routes.home} aria-label="Softaura Technology — home">
            <Wordmark size="md" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-subtle">
            {site.tagline}. Building software for teams in{" "}
            {contact.regions.join(" and ")}.
          </p>
        </div>

        {footerNav.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.14em] text-foreground uppercase">
              {group.heading}
            </h3>
            <ul className="flex flex-col gap-3">
              {group.items.map((item) => (
                <li key={`${group.heading}-${item.label}`}>
                  <Link
                    href={item.href}
                    data-cursor="hover"
                    className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.14em] text-foreground uppercase">
            Contact
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <a
                href={`mailto:${contact.email}`}
                data-cursor="hover"
                className="inline-flex items-center gap-2 text-muted transition-colors duration-200 hover:text-foreground"
              >
                <Icon name="mail" size={15} className="text-subtle" />
                {contact.email}
              </a>
            </li>
            {contact.phones.map((phone) => (
              <li key={phone.e164}>
                <a
                  href={`tel:+${phone.e164}`}
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 text-muted transition-colors duration-200 hover:text-foreground"
                >
                  <Icon name="phone" size={15} className="text-subtle" />
                  {phone.display}
                  <span className="text-xs text-subtle">({phone.label})</span>
                </a>
              </li>
            ))}
            {whatsappLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="hover"
                  className="text-muted transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Legal bar */}
      <div className="border-t border-border-subtle">
        <Container className="flex flex-col items-start justify-between gap-4 py-7 sm:flex-row sm:items-center">
          <p className="text-sm text-subtle">
            © {copyrightRange} {site.name}. All rights reserved.
          </p>

          {/* Rendered only when a real profile URL exists — see `socials` in
              constants/site.ts. An empty list renders nothing at all. */}
          {activeSocials.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {activeSocials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="hover"
                    className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </div>
    </footer>
  );
}
