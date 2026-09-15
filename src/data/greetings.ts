import type { IconName } from "@/components/ui/Icon";
import { contact } from "@/constants/site";

/**
 * Greetings — the acknowledgement shown when someone reaches out.
 *
 * ## Only for things that finish where you are
 *
 * Every entry below is an action that completes in place: opening WhatsApp,
 * starting a call, opening a mail client, opening the assistant, sending the
 * enquiry form. None of them navigate this site.
 *
 * That boundary is the whole design. A greeting in front of a link to
 * `/contact` would put several hundred milliseconds between a conversion click
 * and the page it was meant to reach, every time, for everyone — and repeat
 * visitors read that as the site being slow rather than as a nice touch. The
 * greeting is a *confirmation* that something happened, which is exactly what
 * these five actions need and what a page navigation does not: the new page
 * arriving is its own confirmation.
 *
 * ## Why each one is different
 *
 * A single generic toast trains people to stop reading it. Each of these says
 * what specifically is about to happen, so the text carries information — which
 * app is opening, which number is ringing, how long a reply will take — rather
 * than just acknowledging the tap.
 *
 * `{name}` in `enquiry` is substituted at render time. Nothing else is
 * templated.
 */

export type GreetingKind = "whatsapp" | "phone" | "email" | "chat" | "enquiry";

export interface Greeting {
  /** Announced to screen readers and shown on screen. */
  text: string;
  icon: IconName;
  /** How long it stays. Longer where there is more to read. */
  durationMs: number;
}

export const greetings: Record<GreetingKind, Greeting> = {
  whatsapp: {
    text: "Opening WhatsApp — talk to you in a moment.",
    icon: "whatsapp",
    durationMs: 1800,
  },
  phone: {
    text: "Calling now. Someone picks up during working hours.",
    icon: "phone",
    durationMs: 1800,
  },
  email: {
    text: "Opening your mail app. We read every one.",
    icon: "mail",
    durationMs: 1800,
  },
  chat: {
    text: "Hello. Ask me anything about what we build.",
    icon: "sparkle",
    durationMs: 1600,
  },
  enquiry: {
    text: `Thank you, {name}. We reply ${contact.responseTime}.`,
    icon: "check",
    durationMs: 2600,
  },
};

/** Fills `{name}`, and degrades to a natural sentence when there is no name. */
export function greetingText(kind: GreetingKind, name?: string): string {
  const raw = greetings[kind].text;
  if (!raw.includes("{name}")) return raw;

  return name
    ? raw.replace("{name}", name.split(/\s+/)[0])
    : raw.replace("{name}, ", "").replace("Thank you", "Thank you");
}
