"use server";

import { contact, site } from "@/constants/site";
import {
  budgetOptions,
  timelineOptions,
  requirementOptions,
  startingPointOptions,
  MAX_LENGTHS,
  MIN_MESSAGE_LENGTH,
  type ContactField,
  type ContactFormState,
} from "@/constants/contactForm";

/**
 * Contact form Server Action.
 *
 * Validation runs on the server because client-side validation is a convenience,
 * not a control — anything can POST to this action directly.
 *
 * Delivery is wired: enquiries are emailed over SMTP (see `deliverEnquiry`). A
 * deployment with no SMTP credentials still validates and still logs, so local
 * development works without secrets — but it no longer pretends a message was
 * sent when it was not. See the note on that below; it is the important part.
 *
 * Not implemented: rate limiting. It needs storage shared across instances
 * (Redis, Upstash, or your host's WAF) — an in-memory counter is useless on
 * serverless, where each request may hit a fresh instance. The honeypot below
 * stops naive bots; add real rate limiting before this URL is public for long.
 */

/* Types, option lists and limits live in `@/constants/contactForm` — see the note
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

/** Human-readable labels for the email body, in the order they are asked. */
const FIELD_LABELS: Record<ContactField, string> = {
  requirement: "Needs",
  startingPoint: "Starting from",
  budget: "Budget",
  timeline: "Timeline",
  name: "Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  message: "Message",
};

/** Escapes a value for interpolation into the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends the enquiry by email over SMTP.
 *
 * `nodemailer` is imported dynamically so it is only pulled in when credentials
 * are actually configured — a deployment without SMTP never loads it, and the
 * module never reaches a bundle that does not need it.
 */
async function sendByEmail(
  payload: Record<ContactField, string>,
  config: { host: string; port: number; user: string; password: string },
): Promise<void> {
  const { default: nodemailer } = await import("nodemailer");

  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    /* 465 is implicit TLS; 587 upgrades with STARTTLS. Deriving this from the
       port rather than asking for a fifth variable removes the most common way
       to misconfigure SMTP. */
    secure: config.port === 465,
    auth: { user: config.user, pass: config.password },
  });

  const rows = (Object.keys(FIELD_LABELS) as ContactField[])
    .filter((field) => payload[field].length > 0)
    .map((field) => ({ label: FIELD_LABELS[field], value: payload[field] }));

  const text = rows.map((row) => `${row.label}: ${row.value}`).join("\n");

  const html = `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">
${rows
  .map(
    (row) =>
      `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top">${escapeHtml(row.label)}</td><td style="padding:6px 0"><strong>${escapeHtml(row.value)}</strong></td></tr>`,
  )
  .join("\n")}
</table>`;

  await transport.sendMail({
    /* From the authenticated mailbox — SPF and DMARC fail if we put the
       enquirer's address here, and the message lands in spam or is rejected. */
    from: `"${site.name} website" <${config.user}>`,
    to: contact.email,
    /* This is the field that makes the mail useful: hitting reply in the inbox
       goes to the enquirer, not back to ourselves. */
    replyTo: payload.email ? `"${payload.name}" <${payload.email}>` : undefined,
    /* Deliberately all-ASCII. An em-dash forces the whole subject into an
       RFC 2047 encoded-word, which then folds across two lines — valid, but
       unreadable in a raw log, in a webhook payload and in older clients. A
       plain hyphen costs nothing and keeps it legible everywhere. */
    subject: `New enquiry: ${payload.requirement || "General"} - ${payload.name}`,
    text,
    html,
  });
}

/**
 * Delivers a validated enquiry.
 *
 * Two transports, checked in order. `CONTACT_WEBHOOK_URL` wins when set, because
 * a deployment that already POSTs into a CRM should keep doing so.
 *
 * **Throwing here is correct and intended.** The caller turns a thrown error
 * into a visible failure with the direct email address as a fallback. The
 * previous version of this function returned quietly when nothing was
 * configured, so the visitor was told "we will be in touch" about a message
 * that had been written to a log and discarded. Someone who believes they have
 * contacted you and has not is worse off than someone told to try again — so an
 * unconfigured *production* deployment now fails loudly.
 *
 * Development is the exception, and only development: with no credentials set,
 * `NODE_ENV !== "production"` logs the enquiry and reports success, so the form
 * can be worked on without secrets.
 */
async function deliverEnquiry(payload: Record<ContactField, string>): Promise<void> {
  const endpoint = process.env.CONTACT_WEBHOOK_URL;

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }),
    });

    if (!response.ok) {
      throw new Error(`Enquiry delivery failed with status ${response.status}`);
    }
    return;
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT ?? 465);

  if (host && user && password && Number.isFinite(port)) {
    await sendByEmail(payload, { host, port, user, password });
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[contact] No delivery configured — enquiry validated and logged, not sent.",
      payload,
    );
    return;
  }

  throw new Error(
    "No delivery transport configured: set SMTP_HOST, SMTP_USER and SMTP_PASSWORD, or CONTACT_WEBHOOK_URL.",
  );
}

/**
 * Form action. Signature matches `useActionState`: `(prevState, formData)`.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values: Record<ContactField, string> = {
    requirement: readField(formData, "requirement"),
    startingPoint: readField(formData, "startingPoint"),
    budget: readField(formData, "budget"),
    timeline: readField(formData, "timeline"),
    name: readField(formData, "name"),
    email: readField(formData, "email"),
    phone: readField(formData, "phone"),
    company: readField(formData, "company"),
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

  /* Step one. Requirement is the only one of the three that is required — it is
     what makes the rest of the form optional, so it has to be answered. */
  if (values.requirement.length === 0) {
    fieldErrors.requirement = "Pick the closest match — we will sort out the detail.";
  } else if (!requirementOptions.includes(values.requirement as (typeof requirementOptions)[number])) {
    fieldErrors.requirement = "Please choose one of the listed options.";
  }

  if (
    values.startingPoint.length > 0 &&
    !startingPointOptions.includes(values.startingPoint)
  ) {
    fieldErrors.startingPoint = "Please choose one of the listed options.";
  }

  /* Optional, but if supplied must be one of ours — a free-text value here means
     the request did not come from our form. */
  if (
    values.budget.length > 0 &&
    !budgetOptions.includes(values.budget)
  ) {
    fieldErrors.budget = "Please choose one of the listed ranges.";
  }

  if (
    values.timeline.length > 0 &&
    !timelineOptions.includes(values.timeline)
  ) {
    fieldErrors.timeline = "Please choose one of the listed options.";
  }

  /* Step two. */
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

  if (values.phone.length > MAX_LENGTHS.phone) {
    fieldErrors.phone = `Please keep this under ${MAX_LENGTHS.phone} characters.`;
  }

  if (values.company.length > MAX_LENGTHS.company) {
    fieldErrors.company = `Please keep this under ${MAX_LENGTHS.company} characters.`;
  }

  /* The message is optional now — requirement, budget and timeline already say
     enough to reply properly. A non-empty one still has to be worth reading. */
  if (values.message.length > 0 && values.message.length < MIN_MESSAGE_LENGTH) {
    fieldErrors.message = `A little more detail helps — at least ${MIN_MESSAGE_LENGTH} characters, or leave it blank.`;
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
    /* The name comes back so the client can thank them by it. Nothing else is
       echoed on success: the form is replaced by the confirmation, so there is
       nothing left to repopulate. */
    values: { name: values.name },
  };
}
