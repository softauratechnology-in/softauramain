"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";
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
import { useGreeting } from "@/components/greeting/GreetingProvider";
import {
  budgetOptions,
  timelineOptions,
  requirementOptions,
  initialContactState,
  MAX_LENGTHS,
  MIN_MESSAGE_LENGTH,
} from "@/constants/contactForm";

/**
 * Contact form — two steps, one submission.
 *
 * ## Why it is not a wizard
 *
 * Both steps render into the same `<form>` and the inactive one is *hidden*,
 * never unmounted. So there is still exactly one POST to one Server Action,
 * validation stays in one place on the server, and nothing has to be carried
 * between requests.
 *
 * ## Why it still works with JavaScript off
 *
 * The step-hiding only switches on *after mount* — `enhanced` starts `false`, so
 * the server renders, and a browser without the bundle keeps, one long form with
 * every field visible and a working submit button. A visitor with JavaScript
 * gets the two-step version a moment later. A wizard that hides step two behind
 * a button with no JavaScript behind it is a form that cannot be submitted at
 * all, which is the failure this avoids.
 *
 * ## What changed and why
 *
 * The old form asked for a name, an email and at least twenty characters
 * describing the project before it would accept anything. That is a lot to ask
 * of someone who knows only that they want an ERP. Now the first question is
 * *what do you need*, answered by tapping one chip, and the written message is
 * optional — requirement, budget and timeline already say enough to reply
 * properly.
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

  /*
   * Is the client bundle actually running?
   *
   * `useSyncExternalStore` answers this without an effect: React calls the third
   * argument on the server and during hydration, and the second one on the
   * client thereafter. So this is `false` in the server-rendered HTML — where
   * both steps are visible and the form submits without JavaScript — and `true`
   * a moment after hydration, which is when the two-step behaviour switches on.
   *
   * The subscribe callback never fires; the value changes exactly once, when
   * hydration completes.
   */
  const enhanced = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [step, setStep] = useState<1 | 2>(1);
  const [requirement, setRequirement] = useState(values.requirement ?? "");
  const [stepError, setStepError] = useState<string | null>(null);

  const stepTwoRef = useRef<HTMLDivElement>(null);

  /*
   * A server-side failure can belong to either step, and the user has to be
   * looking at the step the error is on — otherwise it is announced against a
   * control they cannot see.
   *
   * Adjusted during render rather than in an effect. This is React's documented
   * pattern for reacting to a changed prop or prior state: it re-renders
   * immediately, before anything is painted, where an effect would paint the
   * wrong step first and then correct it.
   */
  const { greet } = useGreeting();

  /*
   * Bumped every time an action result comes back, and used as the requirement
   * fieldset's `key` so those radios remount.
   *
   * React 19 resets the form after an action completes. For the text inputs
   * that is harmless — reset restores them to `defaultValue`, which is the
   * value the server just echoed back. The radios have no `defaultChecked`, so
   * reset clears them in the DOM while this component's `requirement` state
   * still says one is selected. React then re-renders, sees nothing changed,
   * and leaves the DOM alone: the chip still looks selected, and the next
   * submit sends no requirement at all.
   *
   * Remounting is what makes React write `checked` back to the DOM. It costs a
   * focus reset on a control the user is not looking at — they are on step two
   * when this happens — which is a good trade for a field that silently
   * emptied itself.
   */
  const [generation, setGeneration] = useState(0);

  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    setGeneration((value) => value + 1);
    if (state.status === "error") {
      setStep(
        fieldErrors.requirement || fieldErrors.budget || fieldErrors.timeline
          ? 1
          : 2,
      );
    }
  }

  /*
   * The thank-you, fired when the action comes back successful.
   *
   * In an effect rather than during render, which is where it started: `greet`
   * updates `GreetingProvider`'s state, and updating *another* component's
   * state while this one renders is not allowed — React drops it. Adjusting
   * this component's own `step` during render (above) is fine and is a
   * documented pattern; reaching into a different component is not.
   *
   * `state` is a fresh object per action result, so this runs once per
   * submission rather than on every re-render.
   */
  useEffect(() => {
    if (state.status !== "success") return;
    /* Named, because this is the one greeting that follows something the
       visitor put real effort into. The success card says what happens next;
       this says thank you, by name, the moment it lands. */
    greet("enquiry", state.values?.name);
  }, [state, greet]);

  function goToStepTwo() {
    if (!requirement) {
      setStepError("Pick the closest match — we will sort out the detail.");
      return;
    }
    setStepError(null);
    setStep(2);
    /* Move focus into the step that just appeared, or a keyboard and screen
       reader user is left at a button that has vanished. */
    window.requestAnimationFrame(() => {
      stepTwoRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    });
  }

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

  const showStepOne = !enhanced || step === 1;
  const showStepTwo = !enhanced || step === 2;

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

      {enhanced ? (
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">
            Step {step} of 2
          </span>
          <span aria-hidden className="flex flex-1 gap-1.5">
            {[1, 2].map((n) => (
              <span
                key={n}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-350",
                  n <= step ? "bg-brand-strong" : "bg-border-subtle",
                )}
              />
            ))}
          </span>
        </div>
      ) : null}

      {/* ── Step 1 — what do you need ─────────────────────────────────────── */}
      <div className={cn("flex flex-col gap-6", !showStepOne && "hidden")}>
        <fieldset key={generation}>
          <legend className="text-sm font-medium text-foreground">
            What do you need?{" "}
            <span className="text-error" aria-hidden>
              *
            </span>
          </legend>
          <p id="requirement-hint" className="mt-1.5 text-sm text-subtle">
            Closest match is fine — we will work out the detail with you.
          </p>

          {/* Radios, not a select. Ten options a thumb can hit beats a dropdown
              on a phone, and the whole point of this step is that it takes one
              tap. Native radios keep it keyboard- and screen-reader-correct. */}
          <div className="mt-4 flex flex-wrap gap-2.5">
            {requirementOptions.map((option) => (
              <label
                key={option}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors duration-200",
                  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                  requirement === option
                    ? "border-brand-strong bg-brand-strong text-white"
                    : "border-border-subtle text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                <input
                  type="radio"
                  name="requirement"
                  value={option}
                  checked={requirement === option}
                  onChange={() => {
                    setRequirement(option);
                    setStepError(null);
                  }}
                  className="sr-only"
                  aria-describedby="requirement-hint"
                />
                {option}
              </label>
            ))}
          </div>

          {stepError || fieldErrors.requirement ? (
            <p role="alert" className="mt-3 text-sm text-error">
              {stepError ?? fieldErrors.requirement}
            </p>
          ) : null}
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field htmlFor="budget" label="Indicative budget" error={fieldErrors.budget}>
            <select
              {...fieldControlProps("budget", fieldErrors.budget)}
              name="budget"
              defaultValue={values.budget ?? ""}
              className={selectClass(fieldErrors.budget)}
            >
              <option value="">Not sure / prefer not to say</option>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field htmlFor="timeline" label="When would you start?" error={fieldErrors.timeline}>
            <select
              {...fieldControlProps("timeline", fieldErrors.timeline)}
              name="timeline"
              defaultValue={values.timeline ?? ""}
              className={selectClass(fieldErrors.timeline)}
            >
              <option value="">No fixed date</option>
              {timelineOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {enhanced ? (
          <div>
            <Button type="button" size="lg" icon="arrowRight" onClick={goToStepTwo}>
              Continue
            </Button>
          </div>
        ) : null}
      </div>

      {/* ── Step 2 — who you are ──────────────────────────────────────────── */}
      <div
        ref={stepTwoRef}
        className={cn("flex flex-col gap-6", !showStepTwo && "hidden")}
      >
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

          <Field htmlFor="email" label="Email" required error={fieldErrors.email}>
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

          <Field htmlFor="phone" label="Phone or WhatsApp" error={fieldErrors.phone}>
            <input
              {...fieldControlProps("phone", fieldErrors.phone)}
              name="phone"
              type="tel"
              autoComplete="tel"
              defaultValue={values.phone}
              maxLength={MAX_LENGTHS.phone}
              className={inputClass(fieldErrors.phone)}
              placeholder="+91 98765 43210"
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
        </div>

        <Field
          htmlFor="message"
          label="Anything else? (optional)"
          error={fieldErrors.message}
          hint={`You have already told us what you need — this is only if there is more. At least ${MIN_MESSAGE_LENGTH} characters if you use it.`}
        >
          <textarea
            {...fieldControlProps(
              "message",
              fieldErrors.message,
              "Optional. Anything else that would help us reply usefully.",
            )}
            name="message"
            defaultValue={values.message}
            maxLength={MAX_LENGTHS.message}
            className={textareaClass(fieldErrors.message)}
            placeholder="We run a logistics business and need to replace three spreadsheets with a proper dispatch system…"
          />
        </Field>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <SubmitButton />
          {enhanced ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(1)}
              className="sm:order-first"
            >
              Back
            </Button>
          ) : null}
          <p className="text-xs text-subtle">
            We will only use your details to reply to this enquiry.
          </p>
        </div>
      </div>

      {/* Honeypot. Hidden from sight and from assistive tech, but present in the
          DOM for bots to fill — see the check in the Server Action.
          `sr-only` is not enough: screen-reader users would find and fill it. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
    </form>
  );
}
