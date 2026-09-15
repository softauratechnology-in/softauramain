"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import {
  chatGreeting,
  chatQuickReplies,
  chatFallback,
  chatHandoffPrompt,
} from "@/data/chatIntents";
import { routes } from "@/constants/navigation";
import { useGreeting } from "@/components/greeting/GreetingProvider";
import { transitions } from "@/animations/variants";
import type { findAnswer as FindAnswer } from "@/lib/chatIndex";

/**
 * The site assistant.
 *
 * ## What it is, precisely
 *
 * A retrieval bot over this site's own content. It matches a question against
 * roughly seventy passages already published here and returns the best one
 * verbatim, with a link to the page it came from. It does not generate text, so
 * it cannot invent a price, promise a delivery date, or describe a capability
 * we do not have. When nothing matches well it says so and offers a person.
 *
 * That is a deliberate choice rather than a limitation we are working around.
 * A language model answering freely about commercial terms on a software
 * company's own site is a liability with a monthly bill attached; this answers
 * instantly, costs nothing per conversation, and is wrong only if the page it
 * quoted was already wrong.
 *
 * It is also the demonstration behind `/solutions/ai-chatbot` — a visitor
 * asking whether we build these can use one while they read about it.
 *
 * ## Loading
 *
 * `lib/chatIndex.ts` pulls in most of the site's content data, so it is
 * `import()`ed on first open rather than at module scope. A visitor who never
 * opens the chat downloads none of it.
 *
 * ## Stacking
 *
 * Shares the bottom-right corner with `WhatsAppWidget`, sitting directly above
 * it in the same column. Both are `z-20`, below the mobile nav sheet (`z-30`)
 * and the header (`z-40`), so neither ever floats over an open menu.
 */

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  href?: string;
  hrefLabel?: string;
  /** Marks a reply the index could not answer, so the UI can offer a person. */
  unanswered?: boolean;
}

let messageCounter = 0;
const nextId = () => `m${++messageCounter}`;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);

  const { greet } = useGreeting();
  const rootRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /* Resolved once, on first open, and reused after. */
  const findRef = useRef<typeof FindAnswer | null>(null);
  const panelId = useId();

  /* Escape closes, and so does a click outside — the same two dismissals the
     mobile nav sheet and the WhatsApp launcher offer. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  /* Keep the newest message in view. `scrollTop` rather than `scrollIntoView`,
     which scrolls the whole page as well as the log. */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, thinking]);

  const ask = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: trimmed },
    ]);
    setDraft("");
    setThinking(true);

    /* Load the index on first use. */
    if (!findRef.current) {
      const mod = await import("@/lib/chatIndex");
      findRef.current = mod.findAnswer;
    }

    const match = findRef.current(trimmed);

    /* A beat before the reply. Not theatre — an answer appearing in the same
       frame as the question reads as a page glitch rather than a response, and
       there is nothing to re-read if you blinked. Short enough not to feel like
       waiting. */
    await new Promise((resolve) => setTimeout(resolve, 320));

    setMessages((prev) => [
      ...prev,
      match
        ? {
            id: nextId(),
            role: "bot",
            text: match.answer.answer,
            href: match.answer.href,
            hrefLabel: match.answer.hrefLabel,
          }
        : { id: nextId(), role: "bot", text: chatFallback, unanswered: true },
    ]);
    setThinking(false);
  }, []);

  function openChat() {
    setOpen(true);
    /* Only on a fresh conversation. Greeting someone who is reopening a thread
       they were already reading is noise, not a welcome. */
    if (messages.length === 0) greet("chat");
    if (messages.length === 0) {
      setMessages([{ id: nextId(), role: "bot", text: chatGreeting }]);
    }
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div
      ref={rootRef}
      className="fixed right-4 bottom-[5.25rem] z-20 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)] sm:right-6 sm:bottom-[5.75rem]"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Site assistant"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={transitions.fast}
            className="flex h-[min(30rem,70vh)] w-[min(22rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-card border border-border-subtle bg-surface shadow-[0_24px_64px_-16px_rgb(0_0_0/0.25)]"
          >
            <header className="flex items-center gap-3 border-b border-border-subtle px-4 py-3.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/12 text-brand-strong">
                <Icon name="sparkle" size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">Ask SoftAura</p>
                {/* Says what it is. A bot that lets you assume it is a person is
                    a bot that disappoints you thirty seconds later. */}
                <p className="truncate text-xs text-subtle">
                  Answers from this site, not a person
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close the assistant"
                className="grid h-8 w-8 place-items-center rounded-full text-subtle transition-colors duration-200 hover:bg-surface-hover hover:text-foreground"
              >
                <Icon name="close" size={16} />
              </button>
            </header>

            {/* `aria-live="polite"` so replies are announced without
                interrupting whatever the reader is doing. */}
            <div
              ref={logRef}
              aria-live="polite"
              className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    message.role === "user"
                      ? "self-end bg-brand-strong text-white"
                      : "self-start bg-surface-hover text-muted",
                  )}
                >
                  <p className="text-pretty">{message.text}</p>

                  {message.href ? (
                    <Link
                      href={message.href}
                      onClick={() => setOpen(false)}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-brand-strong hover:underline"
                    >
                      {message.hrefLabel ?? "Read more"}
                      <Icon name="arrowRight" size={13} />
                    </Link>
                  ) : null}

                  {message.unanswered ? (
                    <Link
                      href={routes.contact}
                      onClick={() => setOpen(false)}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-brand-strong hover:underline"
                    >
                      {chatHandoffPrompt}
                      <Icon name="arrowRight" size={13} />
                    </Link>
                  ) : null}
                </div>
              ))}

              {thinking ? (
                <p className="self-start text-xs text-subtle" role="status">
                  Looking that up…
                </p>
              ) : null}

              {/* Quick replies, while the conversation is short. Most people
                  never type a character, which is the point on a phone. */}
              {messages.length <= 1 && !thinking ? (
                <div className="mt-1 flex flex-wrap gap-2">
                  {chatQuickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => ask(reply)}
                      className="rounded-full border border-border-subtle px-3 py-1.5 text-xs text-muted transition-colors duration-200 hover:border-brand-strong hover:text-foreground"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                ask(draft);
              }}
              className="flex items-center gap-2 border-t border-border-subtle px-3 py-3"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about cost, timelines, ERP…"
                aria-label="Ask a question"
                maxLength={200}
                className="h-10 min-w-0 flex-1 rounded-full border border-border-subtle bg-background px-4 text-sm text-foreground outline-none placeholder:text-subtle focus-visible:border-brand-strong"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send"
                disabled={!draft.trim() || thinking}
              >
                <Icon name="arrowRight" size={16} />
              </Button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!open ? (
        <button
          type="button"
          onClick={openChat}
          aria-expanded={false}
          aria-controls={panelId}
          aria-label="Ask the site assistant a question"
          className="group/chat flex h-14 w-14 items-center justify-center rounded-full bg-brand-strong text-white shadow-[0_12px_32px_-10px_color-mix(in_oklab,var(--brand-600)_65%,transparent)] transition-transform duration-350 ease-out-expo hover:scale-105 active:scale-95"
        >
          <Icon name="sparkle" size={22} />
        </button>
      ) : null}
    </div>
  );
}
