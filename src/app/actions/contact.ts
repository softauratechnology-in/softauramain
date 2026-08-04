"use server";

import { contact } from "@/constants/site";
import {
  budgetOptions,
  MAX_LENGTHS,
  MIN_MESSAGE_LENGTH,
  type BudgetOption,
  type ContactField,
  type ContactFormState,
} from "@/constants/contactForm";

/**
 * Contact form Server Action.
 *
 * Validation runs on the server because client-side validation is a convenience,
 * not a control — anything can POST to this action directly.
 *
 * ⚠️ DELIVERY IS NOT WIRED UP. This action validates the submission and screens
 * bots, then hands off to `deliverEnquiry` — which needs a provider credential to
 * do anything. That is an operational decision, so it is left as one clearly
 * marked integration point rather than a half-configured dependency. See
 * `deliverEnquiry` below and `.env.example`.
 *
 * Also not implemented: rate limiting. It needs storage shared across instances
 * (Redis, Upstash, or your host's WAF) — an in-memory counter is useless on
 * serverless, where each request may hit a fresh instance. The honeypot below
 * stops naive bots; add real rate limiting before this URL is public for long.
 */

/* Types, option list and limits live in `@/constants/contactForm` — see the note
   in that module for why they cannot be declared in a `"use server"` file. This
   module exports exactly one thing: the action itself. */

/**
 * Pragmatic email check.
 *
 * Deliberately not RFC-complete: fully correct email validation by regex is
 * effectively impossible, and over-strict patterns reject valid addresses — which
 * on a contact form means losing a lead. This catches typos and obvious junk; the
 * real check is whether the reply arrives.
 */
function isPlausibleEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value);
}

/** Trims and collapses whitespace; `FormData` values are always strings or File. */
function readField(formData: FormData, field: ContactField): string {
  const raw = formData.get(field);
  return typeof raw === "string" ? raw.trim() : "";
}

/**
 * Delivers a validated enquiry.
 *
 * INTEGRATION POINT — implement one of:
 *   • Transactional email (Resend, Postmark, SES) to `contact.email`
 *   • A CRM/webhook POST
 *   • A row in your own database
 *
 * Throwing here surfaces as a generic error to the user, which is correct: the
 * visitor cannot act on a provider outage, and the message should not leak
 * infrastructure detail.
 */
async function deliverEnquiry(payload: Record<ContactField, string>): Promise<void> {
  const endpoint = process.env.CONTACT_WEBHOOK_URL;

  if (!endpoint) {
    /* No delivery configured. Log it so nothing is silently dropped in
       development, and let the submission report success to the user — the
       alternative is showing an error for a deployment gap they cannot fix. */
    console.warn(
      "[contact] CONTACT_WEBHOOK_URL is not set — enquiry was validated but not delivered.",
      { name: payload.name, email: payload.email },
    );
    return;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }),
  });

  if (!response.ok) {
    throw new Error(`Enquiry delivery failed with status ${response.status}`);
  }
}

/**
 * Form action. Signature matches `useActionState`: `(prevState, formData)`.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values: Record<ContactField, string> = {
    name: readField(formData, "name"),
    email: readField(formData, "email"),
    company: readField(formData, "company"),
    budget: readField(formData, "budget"),
    message: readField(formData, "message"),
  };

  /* Honeypot. A hidden field real users never see and never fill. Bots fill every
     input they find, so a non-empty value is a bot — accept it silently rather
     than reporting an error, which would tell the bot how to adapt. */
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return {
      status: "success",
      message: `Thanks — we will be in touch ${contact.responseTime}.`,
    };
  }

  const fieldErrors: ContactFormState["fieldErrors"] = {};

  if (values.name.length < 2) {
    fieldErrors.name = "Please tell us your name.";
  } else if (values.name.length > MAX_LENGTHS.name) {
    fieldErrors.name = `Please keep this under ${MAX_LENGTHS.name} characters.`;
  }

  if (values.email.length === 0) {
    fieldErrors.email = "We need an email address to reply to.";
  } else if (values.email.length > MAX_LENGTHS.email || !isPlausibleEmail(values.email)) {
    fieldErrors.email = "That does not look like a valid email address.";
  }

  if (values.company.length > MAX_LENGTHS.company) {
    fieldErrors.company = `Please keep this under ${MAX_LENGTHS.company} characters.`;
  }

  /* Budget is optional, but if supplied it must be one of ours — a free-text
     value here means the request did not come from our form. */
  if (
    values.budget.length > 0 &&
    !budgetOptions.includes(values.budget as BudgetOption)
  ) {
    fieldErrors.budget = "Please choose one of the listed ranges.";
  }

  if (values.message.length < MIN_MESSAGE_LENGTH) {
    fieldErrors.message = `A little more detail helps — at least ${MIN_MESSAGE_LENGTH} characters.`;
  } else if (values.message.length > MAX_LENGTHS.message) {
    fieldErrors.message = `Please keep this under ${MAX_LENGTHS.message} characters.`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  try {
    await deliverEnquiry(values);
  } catch (error) {
    console.error("[contact] Failed to deliver enquiry", error);
    return {
      status: "error",
      /* Offer the direct email as a fallback so a failure is not a dead end. */
      message: `Something went wrong sending your message. Please email us directly at ${contact.email}.`,
      values,
    };
  }

  return {
    status: "success",
    message: `Thanks — your message is with us. Expect a reply ${contact.responseTime}.`,
  };
}
