import type { ElementType, HTMLAttributes } from "react";

/**
 * Element names our polymorphic components (`Container`, `Card`, `Reveal`) accept
 * for their `as` prop.
 *
 * A closed union rather than `keyof JSX.IntrinsicElements`: these components only
 * ever render a semantic block or list element, and the narrow list means an
 * invalid `as="input"` is caught at the call site.
 */
export type PolymorphicTag =
  | "div"
  | "span"
  | "section"
  | "article"
  | "aside"
  | "figure"
  | "header"
  | "footer"
  | "main"
  | "nav"
  | "ul"
  | "ol"
  | "li";

/**
 * The type to render a `PolymorphicTag` through.
 *
 * Needed because TypeScript intersects the props of every member of a bare
 * `ElementType` union, which collapses to `never` and rejects even `className`.
 * Parameterising `ElementType` with the props we actually pass resolves it while
 * still type-checking those props.
 */
export type PolymorphicComponent = ElementType<HTMLAttributes<HTMLElement>>;

/**
 * Tag name → renderable type.
 *
 * A lookup table rather than a `resolveTag(as)` helper: the
 * `react-hooks/static-components` lint rule flags *any* function call whose result
 * is rendered as a component, since it cannot tell construction from resolution.
 * Indexing a table is unambiguous — and it is a cheaper operation besides.
 */
export const tags = {
  div: "div",
  span: "span",
  section: "section",
  article: "article",
  aside: "aside",
  figure: "figure",
  header: "header",
  footer: "footer",
  main: "main",
  nav: "nav",
  ul: "ul",
  ol: "ol",
  li: "li",
} as const satisfies Record<PolymorphicTag, PolymorphicTag> as Record<
  PolymorphicTag,
  PolymorphicComponent
>;
