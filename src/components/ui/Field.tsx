import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Form field primitives.
 *
 * Shared so that every input in the site — now and whenever a second form is
 * added — has the same height, focus ring and error treatment. The error wiring is
 * the part worth centralising: each field links its message via
 * `aria-describedby` and sets `aria-invalid`, which is easy to forget per-input
 * and invisible when you do.
 */

const controlBase =
  "w-full rounded-xl border bg-surface px-4 text-base text-foreground transition-colors duration-200 " +
  "placeholder:text-subtle/60 focus:border-brand focus:outline-none disabled:opacity-60";

export interface FieldProps {
  /** Must match the control's `id`. */
  htmlFor: string;
  label: string;
  /** Validation message. Presence switches the field into its error state. */
  error?: string;
  /** Helper text below the control. Hidden while an error is showing. */
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/** Label + control + message wrapper. */
export function Field({
  htmlFor,
  label,
  error,
  hint,
  required,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span aria-hidden className="ml-1 text-brand">
            *
          </span>
        ) : (
          <span className="ml-2 text-xs font-normal text-subtle">Optional</span>
        )}
      </label>

      {children}

      {/* `role="alert"` announces the message when it appears after a submit. */}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Accessibility props for a control inside `<Field>`.
 *
 * Call this rather than hand-writing `aria-invalid`/`aria-describedby` per input.
 */
export function fieldControlProps(id: string, error?: string, hint?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}

/** Border colour for a control, driven by its error state. */
export function controlClass(error?: string, extra?: string): string {
  return cn(
    controlBase,
    error ? "border-error/60" : "border-border-subtle hover:border-border-strong",
    extra,
  );
}

/** Single-line text input styling. */
export const inputClass = (error?: string) => controlClass(error, "h-12");

/** Select styling. `appearance-none` plus a caret drawn in CSS. */
export const selectClass = (error?: string) =>
  controlClass(
    error,
    "h-12 appearance-none bg-[image:linear-gradient(45deg,transparent_50%,var(--subtle)_50%),linear-gradient(135deg,var(--subtle)_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-18px)_center,calc(100%-13px)_center] bg-no-repeat pr-12",
  );

/** Multi-line textarea styling. */
export const textareaClass = (error?: string) =>
  controlClass(error, "min-h-36 resize-y py-3.5 leading-relaxed");
