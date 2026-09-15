import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import { Ripple } from "./Ripple";

/**
 * The site's only button.
 *
 * Still a **server component**. Hover, focus and press-scale are pure CSS; the
 * only JavaScript is `<Ripple>`, a small client island mounted *inside* the
 * button that listens for the press one level up. So neither this component nor
 * `Icon` — nor any of the fifteen sections that render a button — is pulled
 * into the client bundle.
 *
 * `overflow-hidden` is load-bearing: the press effects are absolutely
 * positioned children that would otherwise escape the pill radius.
 *
 * Renders `<Link>` for internal hrefs, `<a>` for external ones (detected, not
 * configured) and `<button>` when there is no href.
 */

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium " +
  "transition-[transform,background-color,background-position,border-color,color,box-shadow] duration-350 " +
  "ease-out-expo active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  /**
   * Primary conversion action. One per viewport, ideally.
   *
   * Dual-tone gradient. The fill is drawn at twice the button's width and the
   * *background position* is animated on hover rather than the colours — a
   * compositable property, where cross-fading two gradients is not.
   *
   * Ends on `--secondary-600` rather than `-500` because white body text has to
   * clear AA against the darkest point of the ramp.
   */
  primary:
    "text-white bg-[linear-gradient(120deg,var(--brand-600)_0%,var(--brand-500)_45%,var(--secondary-600)_100%)] " +
    "bg-[length:200%_100%] bg-[position:0%_50%] hover:bg-[position:100%_50%] " +
    "shadow-[0_12px_32px_-10px_color-mix(in_oklab,var(--brand-600)_65%,transparent)] " +
    "hover:shadow-[0_18px_44px_-10px_color-mix(in_oklab,var(--secondary-600)_60%,transparent)] " +
    /* Press pulls the glow in tight under the button, so the press-scale reads
       as the button being pushed toward the page rather than just shrinking. */
    "active:shadow-[0_6px_18px_-8px_color-mix(in_oklab,var(--brand-700)_75%,transparent)]",
  /**
   * Equal-weight alternative next to a primary.
   *
   * Ghost by rule: no fill at rest, only a brand hairline and brand label. The
   * background appears *solely* on hover/focus, and the label flips to white in
   * the same beat so it never sits mid-transition against a colour it cannot be
   * read on. `brand-600` is the fill (not `brand-500`) for the same AA reason.
   *
   * That pairing is why the press effect here is a `sweep` rather than the
   * `ripple` used on primary: a directional fill would repaint the background
   * progressively while the label had already flipped, stranding white text on
   * the off-white canvas at whichever end the wipe had not reached. The sweep
   * and its border ring sit *over* whatever the fill currently is, so neither
   * state can be broken. See `Ripple.tsx`.
   */
  secondary:
    "bg-transparent text-brand-strong border border-[color-mix(in_oklab,var(--brand-600)_30%,transparent)] " +
    "hover:bg-brand-strong hover:text-white hover:border-brand-strong " +
    "focus-visible:bg-brand-strong focus-visible:text-white focus-visible:border-brand-strong",
  /** Inline, low-emphasis — nav links, card footers. */
  ghost: "text-muted hover:text-foreground",
  /** On dark imagery or gradient backdrops. */
  outline:
    "border border-foreground/25 text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm sm:text-base",
  lg: "h-13 px-7 text-base",
  /**
   * Square, no horizontal padding — a circular control holding one glyph and
   * no label, so it needs an `aria-label`.
   *
   * A size entry rather than a `className` override at the call site, because
   * `cn()` has no tailwind-merge: a `px-0` passed in would land *beside* `px-4`
   * rather than replacing it, and which one won would come down to stylesheet
   * order. Capability belongs in the variant maps.
   */
  icon: "h-10 w-10",
};

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Trailing icon. Slides right on hover, which is the whole micro-interaction. */
  icon?: IconName;
  /** Stretch to the container width — mobile CTAs and form submits. */
  fullWidth?: boolean;
  className?: string;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Treats mail/tel/protocol-absolute URLs as external. */
function isExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href);
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    icon,
    fullWidth,
    className,
    ...rest
  } = props;

  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  /* `relative` on the label and icon lifts them above the press effects without
     needing a stacking context: the ripple host is painted first because it
     comes first in DOM order, and positioned siblings paint over it. */
  const content = (
    <>
      <Ripple mode={variant === "secondary" ? "sweep" : "ripple"} />
      <span className="relative">{children}</span>
      {icon ? (
        <Icon
          name={icon}
          size={18}
          className="relative transition-transform duration-350 ease-out-expo group-hover/btn:translate-x-1"
        />
      ) : null}
    </>
  );

  if (props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };

    if (isExternal(href)) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noreferrer noopener" }
            : {})}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
