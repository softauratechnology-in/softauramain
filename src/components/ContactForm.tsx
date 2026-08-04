"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  Field,
  fieldControlProps,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/ui/Field";
import { submitContactForm } from "@/app/actions/contact";
import {
  budgetOptions,
  initialContactState,
  MAX_LENGTHS,
  MIN_MESSAGE_LENGTH,
} from "@/constants/contactForm";

/**
 * Contact form.
 *
 * Progressive enhancement by design: this is a real `<form action={...}>` bound to
 * a Server Action, so it submits and validates even if the client bundle never
 * loads. JavaScript only adds the pending state and inline error rendering.
 *
 * `useActionState` holds the returned state across submits, which is how typed
 * values survive a validation failure instead of being wiped.
 */

/**
 * Submit button.
 *
 * Split into its own component because `useFormStatus` reads the *enclosing*
 * form's pending state — it must be a descendant of the `<form>`, and calling it
 * in the same component that renders the form returns `pending: false` forever.
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      icon={pending ? undefined : "arrowRight"}
      fullWidth
      className="sm:w-auto"
    >
      {pending ? "Sending…" : "Send enquiry"}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialContactState);
  const { fieldErrors = {}, values = {} } = state;

  /* On success the form is replaced by the confirmation — leaving a filled form
     next to a "message sent" notice invites a duplicate submission. */
  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-card border border-success/30 bg-success/[0.07] p-8"
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-success/15 text-success">
          <Icon name="check" size={22} />
        </span>
        <h3 className="font-display text-xl font-bold tracking-tight">
          Message received
        </h3>
        <p className="text-sm leading-relaxed text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {/* Summary error. `role="alert"` is an assertive live region, so it is
          announced on appearance without stealing focus from the form. */}
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="rounded-xl border border-error/40 bg-error/[0.07] px-4 py-3 text-sm text-foreground"
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field htmlFor="name" label="Your name" required error={fieldErrors.name}>
          <input
            {...fieldControlProps("name", fieldErrors.name)}
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={values.name}
            maxLength={MAX_LENGTHS.name}
            className={inputClass(fieldErrors.name)}
            placeholder="Priya Raman"
          />
        </Field>

        <Field htmlFor="email" label="Work email" required error={fieldErrors.email}>
          <input
            {...fieldControlProps("email", fieldErrors.email)}
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values.email}
            maxLength={MAX_LENGTHS.email}
            className={inputClass(fieldErrors.email)}
            placeholder="priya@company.com"
          />
        </Field>

        <Field htmlFor="company" label="Company" error={fieldErrors.company}>
          <input
            {...fieldControlProps("company", fieldErrors.company)}
            name="company"
            type="text"
            autoComplete="organization"
            defaultValue={values.company}
            maxLength={MAX_LENGTHS.company}
            className={inputClass(fieldErrors.company)}
            placeholder="Company name"
          />
        </Field>

        <Field htmlFor="budget" label="Indicative budget" error={fieldErrors.budget}>
          <select
            {...fieldControlProps("budget", fieldErrors.budget)}
            name="budget"
            defaultValue={values.budget ?? ""}
            className={selectClass(fieldErrors.budget)}
          >
            <option value="">Select a range</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        htmlFor="message"
        label="What are you building?"
        required
        error={fieldErrors.message}
        hint={`The problem you are solving, who it is for, and any deadline you are working to. At least ${MIN_MESSAGE_LENGTH} characters.`}
      >
        <textarea
          {...fieldControlProps(
            "message",
            fieldErrors.message,
            "The problem you are solving, who it is for, and any deadline you are working to.",
          )}
          name="message"
          defaultValue={values.message}
          maxLength={MAX_LENGTHS.message}
          className={textareaClass(fieldErrors.message)}
          placeholder="We run a logistics business and need to replace three spreadsheets with a proper dispatch system…"
        />
      </Field>

      {/* Honeypot. Hidden from sight and from assistive tech, but present in the
          DOM for bots to fill — see the check in the Server Action.
          `sr-only` is not enough: screen-reader users would find and fill it. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SubmitButton />
        <p className="text-xs text-subtle">
          We will only use your details to reply to this enquiry.
        </p>
      </div>
    </form>
  );
}
