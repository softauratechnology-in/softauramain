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

export type ContactField = "name" | "email" | "company" | "budget" | "message";

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
 * Budget bands offered in the select.
 *
 * The Server Action validates submissions against this exact list, so the options
 * the user sees and the values the server accepts cannot drift apart.
 */
export const budgetOptions = [
  "Under $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k – $100k",
  "$100k+",
  "Not sure yet",
] as const;

export type BudgetOption = (typeof budgetOptions)[number];

/** Maximum accepted length per field. Mirrored onto the inputs as `maxLength`. */
export const MAX_LENGTHS: Record<ContactField, number> = {
  name: 100,
  email: 254, // RFC 5321 maximum
  company: 120,
  budget: 40,
  message: 4000,
};

/** Below this, an enquiry is too vague to respond to usefully. */
export const MIN_MESSAGE_LENGTH = 20;
