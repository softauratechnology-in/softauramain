import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { text } from "@/styles/typography";
import { cn } from "@/lib/cn";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center overflow-hidden">
      <div aria-hidden className="bg-brand-glow absolute inset-0" />
      <Container className="relative py-24 text-center">
        <p className={cn(text.eyebrow, "mb-5")}>Error 404</p>
        <h1 className={cn(text.display, "text-balance")}>
          This page doesn&rsquo;t exist
        </h1>
        <p className={cn(text.lead, "mx-auto mt-6 max-w-lg text-pretty")}>
          The link may be out of date, or the page may have moved. Everything we do
          is on the home page.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/" size="lg" icon="arrowRight">
            Back to home
          </Button>
          <Button href="/#contact" size="lg" variant="secondary">
            Contact us
          </Button>
        </div>
      </Container>
    </main>
  );
}
