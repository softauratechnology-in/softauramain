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
import { OptionCards } from "@/components/ui/OptionCards";
import {
  Field,
  fieldControlProps,
  inputClass,
  textareaClass,
} from "@/components/ui/Field";
import { submitContactForm } from "@/app/actions/contact";
import { useGreeting } from "@/components/greeting/GreetingProvider";
import {
  requirementChoices,
  startingPointChoices,
  timelineChoices,
  budgetChoices,
  initialContactState,
  MAX_LENGTHS,
  MIN_MESSAGE_LENGTH,
  TOTAL_STEPS,
} from "@/constants/contactForm";

/**
 * Booking form — three steps, one submission.
 *
 * ## Why it is not a wizard
 *
 * Every step renders into the same `<form>` and the inactive ones are *hidden*,
 * never unmounted. So there is still exactly one POST to one Server Action,
 * validation stays in one place on the server, and nothing has to be carried
 * between requests.
 *
 * ## Why it still works with JavaScript off
 *
 * The step-hiding only switches on *after mount* — `enhanced` is false during
 * SSR and hydration, so a browser without the bundle keeps one long form with
 * every question visible and a working submit button. A wizard that hides the
 * last step behind a button with no JavaScript behind it is a form that cannot
 * be submitted at all, which is the failure this avoids.
 *
 * ## Three steps, and what that costs
 *
 * This was two. Cards sell a choice far better than the plain pills they
 * replaced — "Custom ERP Software" means little until it says "run the whole
 * business from one system" underneath — but they are tall, and four card
 * questions on one screen was three phone-screens of scrolling before the first
 * button.
 *
 * The cost is real: every step is somewhere people leave, and the contact
 * details are now two taps away rather than one. It is mitigated, not erased,
 * by only step 1 being required — step 2 can be passed through in a single tap.
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

type Step = 1 | 2 | 3;

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialContactState);
  const { fieldErrors = {}, values = {} } = state;

  /*
   * Is the client bundle actually running?
   *
   * `useSyncExternalStore` answers this without an effect: React calls the third
   * argument on the server and during hydration, and the second one on the
   * client thereafter. So this is `false` in the server-rendered HTML — where
   * every step is visible and the form submits without JavaScript — and `true`
   * a moment after hydration, which is when the stepping switches on.
   */
  const enhanced = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [step, setStep] = useState<Step>(1);
  const [stepError, setStepError] = useState<string | null>(null);

  /* One piece of state per card question. Controlled, because the card's
     appearance depends on it and the DOM radio is visually hidden. */
  const [requirement, setRequirement] = useState(values.requirement ?? "");
  const [startingPoint, setStartingPoint] = useState(values.startingPoint ?? "");
  const [timeline, setTimeline] = useState(values.timeline ?? "");
  const [budget, setBudget] = useState(values.budget ?? "");

  const { greet } = useGreeting();
  const stepRef = useRef<HTMLDivElement>(null);

  /*
   * Bumped every time an action result comes back, and used as each card
   * question's `key` so its radios remount.
   *
   * React 19 resets the form after an action completes. For the text inputs that
   * is harmless — reset restores them to `defaultValue`, which is the value the
   * server just echoed back. The radios have no `defaultChecked`, so reset
   * clears them in the DOM while this component's state still says one is
   * selected. React then re-renders, sees nothing changed, and leaves the DOM
   * alone: the card still looks selected, and the next submit sends nothing.
   *
   * This bug shipped once already on the requirement question and silently
   * emptied it on every resubmit. All four questions are keyed now, not just the
   * one that was caught.
   */
  const [generation, setGeneration] = useState(0);

  /*
   * A server-side failure can belong to any step, and the user has to be looking
   * at the one the error is on — otherwise it is announced against a control
   * they cannot see.
   *
   * Adjusted during render rather than in an effect. This is React's documented
   * pattern for reacting to changed state: it re-renders immediately, before
   * anything is painted, where an effect would paint the wrong step first and
   * then correct it.
   */
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    setGeneration((value) => value + 1);

    if (state.status === "error") {
      if (fieldErrors.requirement) {
        setStep(1);
      } else if (
        fieldErrors.startingPoint ||
        fieldErrors.timeline ||
        fieldErrors.budget
      ) {
        setStep(2);
      } else {
        setStep(3);
      }
    }
  }

  /*
   * The thank-you, fired when the action comes back successful.
   *
   * In an effect rather than during render: `greet` updates
   * `GreetingProvider`'s own state, and updating *another* component's state
   * while this one renders is not allowed — React drops it. Adjusting this
   * component's `step` during render (above) is fine and is a documented
   * pattern; reaching into a different component is not.
   */
  useEffect(() => {
    if (state.status !== "success") return;
    greet("enquiry", state.values?.name);
  }, [state, greet]);

  function goTo(next: Step) {
    /* Only the first question is required, so this is the only gate. */
    if (next > 1 && !requirement) {
      setStepError("Pick the closest match — we will sort out the detail.");
      setStep(1);
      return;
    }
    setStepError(null);
    setStep(next);
    /* Move focus into the step that just appeared, or a keyboard and screen
       reader user is left at a button that has vanished. */
    window.requestAnimationFrame(() => {
      stepRef.current
        ?.querySelector<HTMLElement>("input:not([type=hidden]), textarea")
        ?.focus();
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

  const shows = (n: Step) => !enhanced || step === n;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-8">
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
            Step {step} of {TOTAL_STEPS}
          </span>
          <span aria-hidden className="flex flex-1 gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
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

      <div
        ref={step === 1 ? stepRef : undefined}
        className={cn(!shows(1) && "hidden")}
      >
        <OptionCards
          key={`requirement-${generation}`}
          name="requirement"
          legend="What do you need built?"
          hint="Closest match is fine — we will work out the detail with you."
          choices={requirementChoices}
          value={requirement}
          onChange={(value) => {
            setRequirement(value);
            setStepError(null);
          }}
          required
          error={stepError ?? fieldErrors.requirement ?? null}
        />

        {enhanced ? (
          <div className="mt-8">
            <Button
              type="button"
              size="lg"
              icon="arrowRight"
              onClick={() => goTo(2)}
            >
              Continue
            </Button>
          </div>
        ) : null}
      </div>

      <div
        ref={step === 2 ? stepRef : undefined}
        className={cn("flex flex-col gap-8", !shows(2) && "hidden")}
      >
        <OptionCards
          key={`startingPoint-${generation}`}
          name="startingPoint"
          legend="Where are you starting from?"
          hint="It changes what we ask you first, so it is worth a tap."
          choices={startingPointChoices}
          value={startingPoint}
          onChange={setStartingPoint}
          error={fieldErrors.startingPoint ?? null}
        />

        <OptionCards
          key={`timeline-${generation}`}
          name="timeline"
          legend="When would you want to start?"
          choices={timelineChoices}
          value={timeline}
          onChange={setTimeline}
          error={fieldErrors.timeline ?? null}
        />

        <OptionCards
          key={`budget-${generation}`}
          name="budget"
          legend="Roughly what budget do you have in mind?"
          hint="A range is enough. If you do not know yet, say so — that is a normal answer."
          choices={budgetChoices}
          value={budget}
          onChange={setBudget}
          error={fieldErrors.budget ?? null}
        />

        {enhanced ? (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="lg"
              icon="arrowRight"
              onClick={() => goTo(3)}
            >
              Continue
            </Button>
            <Button type="button" variant="ghost" onClick={() => goTo(1)}>
              Back
            </Button>
          </div>
        ) : null}
      </div>

      <div
        ref={step === 3 ? stepRef : undefined}
        className={cn("flex flex-col gap-6", !shows(3) && "hidden")}
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
              onClick={() => goTo(2)}
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
