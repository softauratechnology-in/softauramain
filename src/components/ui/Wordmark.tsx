/**
 * The Softaura wordmark.
 *
 * Single source of truth for the logo lockup — Navbar and Footer differ only in
 * size, so they pass `size` rather than re-declaring the type treatment. The
 * type is set in the neutral grotesk (UI family) with heavy weight and tight
 * tracking, matching the headline style rather than Syne's wider display cut.
 *
 * `LogoMark` is the interlocking S/A monogram that sits to the left of the type.
 * It renders the brand PNG through `next/image`, sized in `em` so it always
 * tracks the surrounding font size.
 *
 * @example
 * <Wordmark size="md" />          // mark + type
 * <Wordmark markOnly />           // favicon-style lockup
 */

import Image from "next/image";
import { cn } from "@/lib/cn";
import { site } from "@/constants/site";

const sizeClass = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-4xl",
} as const;

export type WordmarkSize = keyof typeof sizeClass;

/** The interlocking S/A ribbon monogram, as the brand artwork. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      aria-hidden="true"
      width={537}
      height={639}
      priority
      className={cn("h-[1.55em] w-auto shrink-0", className)}
    />
  );
}


export function Wordmark({
  size = "sm",
  markOnly = false,
  className,
}: {
  size?: WordmarkSize;
  /** Render just the monogram — no type. */
  markOnly?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-sans font-black leading-none tracking-[-0.045em]",
        sizeClass[size],
        className,
      )}
    >
      <LogoMark />

      {markOnly ? (
        <span className="sr-only">{site.shortName}</span>
      ) : (
        <span>
          {site.shortName}
          <span className="text-brand">.</span>
        </span>
      )}
    </span>
  );
}
