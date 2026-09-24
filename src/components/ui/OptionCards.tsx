"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import type { Choice } from "@/constants/contactForm";

/**
 * A question answered by picking one card.
 *
 * Replaces the row of plain pills the booking form used to open with. A pill
 * carries a label and nothing else, which works when the reader already knows
 * what the labels mean — and on this form they often do not. "Custom ERP
 * Software" means little until it says "run the whole business from one system"
 * underneath it.
 *
 * ## Still native radios
 *
 * The visible card is a `<label>` wrapping a visually hidden `<input
 * type="radio">`. That is not decoration: it keeps arrow-key navigation, the
 * roving tab stop, `required`, form reset, and the announcement of "2 of 10"
 * that a screen reader gives a radio group — none of which a `<div
 * role="radio">` gets without reimplementing all of it, usually incompletely.
 *
 * Focus is drawn with `has-[:focus-visible]` on the label, so the ring appears
 * on the card the keyboard is actually on rather than on an invisible input.
 *
 * ## The `featured` card
 *
 * Draws with the gradient border the site already uses for featured service
 * cards. At most one per question — a badge on three options recommends nothing.
 */

export interface OptionCardsProps {
  /** Submitted field name. Shared by every radio in the group. */
  name: string;
  /** The question. Rendered as the fieldset's `<legend>`. */
  legend: string;
  /** One line under the question. */
  hint?: string;
  choices: Choice[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string | null;
  /** Columns at `sm` and up. Two for long labels, three for short ones. */
  columns?: 2 | 3;
  className?: string;
}

export function OptionCards({
  name,
  legend,
  hint,
  choices,
  value,
  onChange,
  required,
  error,
  columns = 2,
  className,
}: OptionCardsProps) {
  const hintId = hint ? `${name}-hint` : undefined;

  return (
    <fieldset className={className}>
      <legend className="text-sm font-medium text-foreground">
        {legend}
        {required ? (
          <span className="ml-1 text-error" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-2 text-xs font-normal text-subtle">Optional</span>
        )}
      </legend>

      {hint ? (
        <p id={hintId} className="mt-1.5 text-sm text-subtle">
          {hint}
        </p>
      ) : null}

      <div
        className={cn(
          "mt-4 grid grid-cols-1 gap-3",
          columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {choices.map((choice) => {
          const selected = value === choice.value;

          return (
            <label
              key={choice.value}
              className={cn(
                "group/card relative flex cursor-pointer flex-col rounded-card border p-4 text-left transition-all duration-200",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                selected
                  ? "border-brand-strong bg-brand/[0.06] shadow-[0_0_0_1px_var(--brand-600)]"
                  : choice.featured
                    ? "border-gradient hover:bg-surface-hover"
                    : "border-border-subtle hover:border-border-strong hover:bg-surface-hover",
              )}
            >
              <input
                type="radio"
                name={name}
                value={choice.value}
                checked={selected}
                onChange={() => onChange(choice.value)}
                required={required}
                aria-describedby={hintId}
                className="sr-only"
              />

              <span className="flex items-start gap-3">
                {choice.icon ? (
                  <Icon
                    name={choice.icon}
                    size={20}
                    className={cn(
                      "mt-0.5 shrink-0 transition-colors duration-200",
                      selected ? "text-brand-strong" : "text-subtle",
                    )}
                  />
                ) : null}

                <span className="flex min-w-0 flex-col">
                  <span
                    className={cn(
                      "text-sm font-semibold text-pretty",
                      selected ? "text-foreground" : "text-foreground",
                    )}
                  >
                    {choice.value}
                  </span>
                  <span className="mt-1 text-xs leading-relaxed text-pretty text-subtle">
                    {choice.benefit}
                  </span>
                </span>

                {/* The tick is the only thing that appears on selection, so it
                    reads as a state change rather than as a layout shift — the
                    space is reserved either way. */}
                <span className="ml-auto grid h-5 w-5 shrink-0 place-items-center">
                  {selected ? (
                    <Icon
                      name="check"
                      size={16}
                      className="text-brand-strong"
                    />
                  ) : null}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
