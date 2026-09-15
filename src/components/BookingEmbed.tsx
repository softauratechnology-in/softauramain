import { cn } from "@/lib/cn";
import { text } from "@/styles/typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { contact, whatsappLinks } from "@/constants/site";
import { WithGreeting } from "@/components/greeting/WithGreeting";

/**
 * Calendar booking.
 *
 * **Integration point.** Set `NEXT_PUBLIC_BOOKING_URL` to a scheduling link
 * (Cal.com, Calendly, Google Appointment Schedule — any of them work, this only
 * needs a URL) and this becomes a "pick a time" card.
 *
 * With the variable unset it does *not* render a dead button, a fake calendar
 * grid or a "coming soon" notice. It falls back to the contact routes that
 * genuinely work today — phone and WhatsApp — so the card is useful in both
 * states and nothing on the page ever promises something that does not happen.
 * That is the whole reason this is a component and not an embedded iframe.
 *
 * The variable is `NEXT_PUBLIC_` because it is read here, in a component that
 * renders a public link; there is nothing secret in a booking URL.
 */
export function BookingEmbed({ className }: { className?: string }) {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  return (
    <Card variant="glass" className={cn("gap-0", className)}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-brand-strong">
          <Icon name="calendar" size={18} />
        </span>
        <div>
          <h3 className={text.h4}>
            {bookingUrl ? "Book a time directly" : "Prefer to talk first?"}
          </h3>
          <p className="mt-2 text-sm text-pretty text-muted">
            {bookingUrl
              ? "Pick a slot that suits you — a 30-minute call, no preparation needed. Bring the problem, not a specification."
              : "Call or message us and we will find a time. A first call is 30 minutes, and you do not need anything prepared."}
          </p>
        </div>
      </div>

      {bookingUrl ? (
        <Button
          href={bookingUrl}
          icon="arrowUpRight"
          className="mt-6 self-start"
        >
          Choose a time
        </Button>
      ) : (
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 pl-12">
          {contact.phones.map((phone) => (
            <li key={phone.e164}>
              <WithGreeting kind="phone">
                <a
                  href={`tel:+${phone.e164}`}
                  className="inline-flex items-center gap-2 text-sm text-brand-strong transition-colors duration-200 hover:text-foreground"
                >
                  <Icon name="phone" size={14} />
                  {phone.display}
                </a>
              </WithGreeting>
            </li>
          ))}
          {whatsappLinks.map((link) => (
            <li key={link.href}>
              <WithGreeting kind="whatsapp">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                  <Icon name="arrowUpRight" size={13} />
                </a>
              </WithGreeting>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
