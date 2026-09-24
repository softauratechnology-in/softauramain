import { landingPages } from "@/data/landingPages";
import type { IconName } from "@/components/ui/Icon";

/**
 * Contact form contract — shared by the client form and the Server Action.
 *
 * This lives outside `app/actions/contact.ts` for a hard technical reason: a module
 * marked `"use server"` may only export async server functions. Every other export
 * is stripped at the client boundary, so importing a constant from it yields
 * `undefined` in the browser — which surfaces as `x.map is not a function` at
 * render time rather than as a build error.
 *
 * Types, option lists and limits therefore live here, and both sides import them.
 */

export type ContactField =
  | "requirement"
  | "startingPoint"
  | "budget"
  | "timeline"
  | "name"
  | "email"
  | "phone"
  | "company"
  | "message";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  /** Human-readable summary, shown above the form. */
  message?: string;
  /** Per-field errors, keyed by input `name`. */
  fieldErrors?: Partial<Record<ContactField, string>>;
  /**
   * Echoed back so a failed submit does not wipe what the user typed. Server
   * Actions re-render the form, so without this every error clears the fields.
   */
  values?: Partial<Record<ContactField, string>>;
}

export const initialContactState: ContactFormState = { status: "idle" };

/**
 * One selectable card.
 *
 * `value` is what is submitted and what the server validates against; `benefit`
 * is the line under the label that makes the choice legible to someone who does
 * not yet know our vocabulary. Every question below is a list of these, so the
 * form renders them all through one component.
 */
export interface Choice {
  value: string;
  benefit: string;
  icon?: IconName;
  /** Draws the card with the gradient border. At most one per question. */
  featured?: boolean;
}

/** The values a `Choice[]` accepts — what the Server Action validates against. */
const valuesOf = (choices: readonly Choice[]) => choices.map((c) => c.value);

/* ── Q1. What do you need built? ──────────────────────────────────────────── */

export const OTHER_REQUIREMENT = "Something else";

/**
 * Derived from `landingPages`, not written out.
 *
 * Every option has a page behind it explaining that exact thing, so a visitor
 * arriving from `/solutions/erp-software` sees "Custom ERP Software" in the list
 * rather than having to translate what they read into our words. Adding a
 * landing page adds a card, and neither list can fall behind the other.
 *
 * `OTHER_REQUIREMENT` is appended because the catalogue is not the world, and a
 * form that pushes someone into the nearest wrong box either loses the enquiry
 * or mislabels it.
 */
export const requirementChoices: Choice[] = [
  ...landingPages.map((page) => ({
    value: page.title,
    benefit: page.bookingBenefit,
    icon: page.icon,
    featured: page.bookingFeatured,
  })),
  {
    value: OTHER_REQUIREMENT,
    benefit: "Describe it in your own words — we will work it out",
    icon: "sparkle" as IconName,
  },
];

export const requirementOptions = valuesOf(requirementChoices);

/* ── Q2. Where are you starting from? ─────────────────────────────────────── */

/**
 * Asked because it changes the first reply more than anything else on this
 * form. "Nothing built yet" and "replacing software we pay for" are different
 * conversations, different timelines and different first questions from us —
 * and knowing which before the call saves the caller explaining it.
 */
export const startingPointChoices: Choice[] = [
  {
    value: "Nothing built yet",
    benefit: "An idea or a need, and a blank page",
    icon: "blueprint",
  },
  {
    value: "We have something that is not working",
    benefit: "It exists, but it is slow, dated or breaking",
    icon: "refresh",
  },
  {
    value: "Replacing off-the-shelf software",
    benefit: "Paying for a product that does not fit",
    icon: "layers",
  },
  {
    value: "Adding to a system we already run",
    benefit: "Extending something that mostly works",
    icon: "plus",
  },
];

export const startingPointOptions = valuesOf(startingPointChoices);

/* ── Q3. When would you start? ────────────────────────────────────────────── */

/**
 * Worth asking because it changes the reply, not because it is a qualifying
 * hurdle — "just exploring" is a legitimate answer and gets a different first
 * email from "as soon as possible", which is the whole point of collecting it.
 */
export const timelineChoices: Choice[] = [
  {
    value: "As soon as possible",
    benefit: "Something is costing you money right now",
    icon: "rocket",
  },
  {
    value: "In the next month or two",
    benefit: "Planned, budgeted, and close",
    icon: "calendar",
  },
  {
    value: "Three to six months",
    benefit: "On the roadmap, scoping it now",
    icon: "chart",
  },
  {
    value: "Just exploring for now",
    benefit: "Working out what it would take",
    icon: "search",
  },
];

export const timelineOptions = valuesOf(timelineChoices);

/* ── Q4. Indicative budget ────────────────────────────────────────────────── */

/**
 * Quoted in rupees and dollars: most enquiries come from India and the UAE, and
 * a band in a currency the reader does not price in is one they have to convert
 * before they can answer.
 *
 * "Not sure yet" is a real option rather than a polite one. A buyer who has not
 * priced this before is not a worse lead, and forcing a guess produces a number
 * nobody can hold either side to.
 */
export const budgetChoices: Choice[] = [
  {
    value: "Under ₹2 lakh",
    benefit: "Under about $2.5k — a focused site or one small tool",
  },
  {
    value: "₹2–6 lakh",
    benefit: "About $2.5k–7k — a site with real functionality",
  },
  {
    value: "₹6–15 lakh",
    benefit: "About $7k–18k — a working web or mobile application",
  },
  {
    value: "₹15–40 lakh",
    benefit: "About $18k–48k — an ERP across several departments",
  },
  {
    value: "Over ₹40 lakh",
    benefit: "Over about $48k — an organisation-wide system",
  },
  {
    value: "Not sure yet",
    benefit: "We will tell you what it should cost",
    icon: "lifebuoy",
  },
];

export const budgetOptions = valuesOf(budgetChoices);

export type BudgetOption = (typeof budgetOptions)[number];
export type TimelineOption = (typeof timelineOptions)[number];

/** Maximum accepted length per field. Mirrored onto the inputs as `maxLength`. */
export const MAX_LENGTHS: Record<ContactField, number> = {
  requirement: 80,
  startingPoint: 80,
  budget: 60,
  timeline: 40,
  name: 100,
  email: 254, // RFC 5321 maximum
  phone: 32,
  company: 120,
  message: 4000,
};

/**
 * Below this, a *written* enquiry is too vague to respond to usefully.
 *
 * The message is optional: requirement, starting point, budget and timeline
 * already say enough to reply properly, and requiring twenty characters of prose
 * from someone who has just answered four questions is asking them to do our
 * job. If they do write something, this still applies — a three-character note
 * is a mis-click, not a message.
 */
export const MIN_MESSAGE_LENGTH = 20;

/**
 * Which fields belong to which step.
 *
 * Three steps, which is one more than this form had. The trade is deliberate and
 * worth recording: cards sell the choice far better than the pills they replace,
 * but they are tall, and putting four card questions on one screen produced
 * three phone-screens of scrolling before the first button.
 *
 * Only step 1 is required. Steps 2 can be passed through in a single tap, so the
 * extra step costs a tap rather than an answer.
 *
 * Declared here rather than in the component so the Server Action can send the
 * user back to the step a failed field actually lives on.
 */
export const STEP_FIELDS: Record<1 | 2 | 3, ContactField[]> = {
  1: ["requirement"],
  2: ["startingPoint", "timeline", "budget"],
  3: ["name", "email", "phone", "company", "message"],
};

export const TOTAL_STEPS = 3;
