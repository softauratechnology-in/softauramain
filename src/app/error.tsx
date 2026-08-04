"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { text } from "@/styles/typography";
import { cn } from "@/lib/cn";
import { contact } from "@/constants/site";

/**
 * Route error boundary.
 *
 * Must be a Client Component — it receives the `reset` callback and renders in
 * response to a client-side error. The error message itself is deliberately not
 * shown to the visitor: it can contain internal detail, and they cannot act on it.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* Replace with your monitoring client (Sentry, etc.) when one is added. */
    console.error("[route error]", error);
  }, [error]);

  return (
    <main className="flex min-h-svh items-center">
      <Container className="py-24 text-center">
        <p className={cn(text.eyebrow, "mb-5")}>Something went wrong</p>
        <h1 className={cn(text.h2, "text-balance")}>
          We hit an unexpected error
        </h1>
        <p className={cn(text.lead, "mx-auto mt-6 max-w-lg text-pretty")}>
          Try again — and if it keeps happening, email us at{" "}
          <a href={`mailto:${contact.email}`} className="text-brand-soft underline">
            {contact.email}
          </a>
          .
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <Button href="/" size="lg" variant="secondary">
            Back to home
          </Button>
        </div>
      </Container>
    </main>
  );
}
