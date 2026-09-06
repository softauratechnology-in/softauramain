import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/ContactForm";
import { SECTION_IDS } from "@/constants/navigation";
import { activeSocials, contact, whatsappLinks } from "@/constants/site";
import { layout } from "@/styles/theme";

/**
 * Contact section.
 *
 * Two columns: the details on the left, the form on the right. The details come
 * first in the DOM so that on mobile — and for a screen-reader user — the direct
 * contact routes are reachable without walking the whole form first.
 */
export function ContactSection() {
  return (
    <section
      id={SECTION_IDS.contact}
      className={cn(layout.sectionY, "relative overflow-hidden")}
    >
      <div aria-hidden className="bg-brand-glow absolute inset-x-0 top-0 h-[28rem]" />

      <Container className="relative">
        <SectionHeading
          eyebrow="Get in touch"
          title="Tell us what you are trying to fix"
          description={`Describe the problem in your own words — you do not need a specification. We will come back with an honest view on what it would take, ${contact.responseTime}.`}
        />

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Direct contact routes */}
          <Reveal variant="slideInLeft" className="lg:col-span-2">
            <div className="flex flex-col gap-8">
              <div>
                <h3 className={cn(text.eyebrow, "mb-4")}>Direct</h3>
                <ul className="flex flex-col gap-4">
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="group/link flex items-start gap-3 text-base text-foreground transition-colors duration-200 hover:text-brand-soft"
                    >
                      <Icon name="mail" size={19} className="mt-0.5 text-brand" />
                      <span className="break-all">{contact.email}</span>
                    </a>
                  </li>
                  {contact.phones.map((phone) => (
                    <li key={phone.e164}>
                      <a
                        href={`tel:+${phone.e164}`}
                        className="flex items-start gap-3 text-base text-foreground transition-colors duration-200 hover:text-brand-soft"
                      >
                        <Icon name="phone" size={19} className="mt-0.5 text-brand" />
                        <span>
                          {phone.display}
                          <span className="ml-2 text-sm text-subtle">
                            {phone.label}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={cn(text.eyebrow, "mb-4")}>WhatsApp</h3>
                <ul className="flex flex-col gap-3">
                  {whatsappLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
                      >
                        {link.label}
                        <Icon name="arrowUpRight" size={14} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={cn(text.eyebrow, "mb-4")}>Where we work</h3>
                <p className="flex items-start gap-3 text-sm text-muted">
                  <Icon name="pin" size={18} className="mt-px text-brand" />
                  {contact.regions.join(" · ")}
                </p>
              </div>

              {activeSocials.length > 0 ? (
                <div>
                  <h3 className={cn(text.eyebrow, "mb-4")}>Elsewhere</h3>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2">
                    {activeSocials.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
                        >
                          {social.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal variant="slideInRight" className="lg:col-span-3">
            {/* `padded={false}` so this padding replaces the card default rather
                than fighting it — the form needs a touch more breathing room. */}
            <Card variant="glass" padded={false} className="p-6 sm:p-9">
              <ContactForm />
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
