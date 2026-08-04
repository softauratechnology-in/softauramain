import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

/**
 * The site's only button.
 *
 * Deliberately a **server component**: every state is pure CSS, and the cursor
 * accent is opt-in through `data-cursor`, which the global `<CustomCursor>` picks
 * up by selector. That keeps buttons out of the client bundle entirely, even in
 * Server Component sections.
 *
 * Renders `<Link>` for internal hrefs, `<a>` for external ones (detected, not
 * configured) and `<button>` when there is no href.
 */

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-350 " +
  "ease-out-expo active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  /** Primary conversion action. One per viewport, ideally. */
  primary:
    "bg-brand text-white shadow-[0_12px_32px_-8px_var(--brand-600)] hover:bg-brand-strong hover:shadow-[0_16px_40px_-8px_var(--brand-500)]",
  /** Equal-weight alternative next to a primary. */
  secondary:
    "bg-surface text-foreground border border-border-subtle hover:border-border-strong hover:bg-surface-hover",
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

  const content = (
    <>
      <span>{children}</span>
      {icon ? (
        <Icon
          name={icon}
          size={18}
          className="transition-transform duration-350 ease-out-expo group-hover/btn:translate-x-1"
        />
      ) : null}
    </>
  );

  /* The attribute the global cursor looks for: it grows the accent dot slightly.
     It never moves the real pointer. */
  const cursorProps = { "data-cursor": "hover" } as const;

  if (props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };

    if (isExternal(href)) {
      return (
        <a
          href={href}
          className={classes}
          {...cursorProps}
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
      <Link href={href} className={classes} {...cursorProps} {...anchorRest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...cursorProps}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
