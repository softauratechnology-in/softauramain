import { landingPages } from "@/data/landingPages";

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
 * What the enquirer needs — the first question the form asks.
 *
 * **Derived from `landingPages`, not written out.** Every option here has a page
 * behind it explaining that exact thing, so a visitor arriving from
 * `/solutions/erp-software` sees "Custom ERP Software" in the list rather than
 * having to translate what they read into our vocabulary. Adding a landing page
 * adds an option, and neither list can fall behind the other.
 *
 * `OTHER_REQUIREMENT` is appended because the catalogue is not the world, and a
 * form that forces someone into the nearest wrong box loses the enquiry or
 * mislabels it. The Server Action validates against this full list.
 */
export const OTHER_REQUIREMENT = "Something else";

export const requirementOptions = [
  ...landingPages.map((page) => page.title),
  OTHER_REQUIREMENT,
] as const;

/**
 * Budget bands offered in the select.
 *
 * The Server Action validates submissions against this exact list, so the options
 * the user sees and the values the server accepts cannot drift apart.
 *
 * Quoted in rupees as well as dollars: most enquiries come from India and the
 * UAE, and a band in a currency the reader does not price in is one they have to
 * convert before they can answer.
 */
export const budgetOptions = [
  "Under ₹2 lakh (under $2.5k)",
  "₹2–6 lakh ($2.5k – $7k)",
  "₹6–15 lakh ($7k – $18k)",
  "₹15–40 lakh ($18k – $48k)",
  "Over ₹40 lakh (over $48k)",
  "Not sure yet",
] as const;

export type BudgetOption = (typeof budgetOptions)[number];

/**
 * When they want to start.
 *
 * Worth asking because it changes the reply, not because it is a qualifying
 * hurdle — "just exploring" is a legitimate answer and gets a different first
 * email from "as soon as possible", which is the whole point of collecting it.
 */
export const timelineOptions = [
  "As soon as possible",
  "In the next month or two",
  "Three to six months",
  "Just exploring for now",
] as const;

export type TimelineOption = (typeof timelineOptions)[number];

/** Maximum accepted length per field. Mirrored onto the inputs as `maxLength`. */
export const MAX_LENGTHS: Record<ContactField, number> = {
  requirement: 80,
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
 * The message is now optional, which is the substantive change to this form:
 * requirement, budget and timeline already say enough to reply properly, and
 * requiring twenty characters of prose from someone who has just told us they
 * want a custom ERP within two months is asking them to do our job. If they do
 * write something, this still applies — a three-character note is a mis-click,
 * not a message.
 */
export const MIN_MESSAGE_LENGTH = 20;

/**
 * The two steps, for the client form's progress indicator.
 *
 * Declared here rather than in the component so the Server Action can name the
 * step a failed field belongs to when it sends the user back.
 */
export const STEP_FIELDS: Record<1 | 2, ContactField[]> = {
  1: ["requirement", "budget", "timeline"],
  2: ["name", "email", "phone", "company", "message"],
};
