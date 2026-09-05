import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import { text } from "@/styles/typography";

/**
 * Disclosure list, built on native `<details>`/`<summary>`.
 *
 * Deliberately **not** a client component. A hand-rolled accordion means
 * shipping JavaScript, wiring `aria-expanded`/`aria-controls`, handling keyboard
 * interaction and re-implementing find-in-page — all of which `<details>` gets
 * right in the browser, for free, with no JS at all. That also means an answer
 * is present in the HTML whether or not it is open, which is what lets search
 * engines and AI assistants read every answer on the page.
 *
 * The open/close animation lives in `globals.css` as `.accordion-panel`, using
 * `::details-content`. Where that is unsupported the panel toggles instantly.
 */

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  /**
   * Opens the first item. Use on a page where the accordion *is* the content,
   * so the reader can see what an answer looks like without a click.
   */
  defaultOpenFirst?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenFirst = false,
  className,
}: AccordionProps) {
  return (
    <div className={cn("divide-y divide-border-subtle", className)}>
      {items.map((item, index) => (
        <details
          key={item.id}
          id={item.id}
          /* No shared `name`: grouping them would make opening one close the
             others, which is hostile when a reader is comparing two answers. */
          open={defaultOpenFirst && index === 0}
          className="accordion-panel group"
        >
          <summary
            data-cursor="hover"
            className={cn(
              text.h4,
              /* `list-none` + the WebKit pseudo-element removes the native
                 disclosure triangle, which cannot be styled to match. */
              "flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left",
              "text-foreground transition-colors duration-200 hover:text-brand-strong",
              "[&::-webkit-details-marker]:hidden",
            )}
          >
            <span className="text-balance">{item.question}</span>
            <span
              aria-hidden
              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border-subtle text-subtle transition-[transform,border-color,color] duration-350 ease-out-expo group-hover:border-border-strong group-hover:text-foreground group-open:rotate-180"
            >
              <Icon name="chevronDown" size={18} />
            </span>
          </summary>

          <p className="max-w-2xl pb-7 text-pretty text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
