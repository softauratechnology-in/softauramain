import { PageTransition } from "@/components/layout/PageTransition";

/**
 * Route template.
 *
 * A template remounts on every navigation (a layout does not), which is what makes
 * the page enter animation replay per route instead of once per session.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
