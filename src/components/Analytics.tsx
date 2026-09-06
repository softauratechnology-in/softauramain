import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Google Analytics 4.
 *
 * Google's install instructions say to paste the tag into the `<head>` of every
 * page. That advice is written for hand-built HTML; in the App Router there is
 * no `<head>` to paste into, and doing it per page would load `gtag.js` more
 * than once. `<GoogleAnalytics>` is Next's own wrapper — it emits exactly the
 * two scripts from the snippet, but through `next/script`, so the loader is
 * deduplicated by id and deferred until after hydration rather than blocking
 * first paint.
 *
 * **Single-page navigation.** Read this before assuming pageviews are complete.
 * The wrapper calls `gtag('config', …)` once and does *not* re-fire on route
 * change — I checked the source rather than assuming. Because App Router
 * navigations are History API pushes and never reload the document, the only
 * thing recording a move from `/services` to `/work` is GA4's own **Enhanced
 * measurement → Page views → "Page changes based on browser history events"**,
 * which is on by default in a GA4 property. If someone turns that off, this
 * site silently drops to one pageview per session. Nothing here can compensate
 * for that, so it is worth knowing where the switch is.
 *
 * We deliberately do not send our own `page_view` on navigation as well: with
 * the enhanced-measurement setting on, that double-counts every route change,
 * which is a worse failure than the one it guards against.
 *
 * For custom events later — a contact-form submission, say — import
 * `sendGAEvent` from `@next/third-parties/google` at the call site.
 */

/**
 * Measurement ID. Not a secret: it is served to every visitor in the page
 * source, which is why it is `NEXT_PUBLIC_`. The literal is the fallback so a
 * deploy that forgets the variable still reports; set the variable to an empty
 * string to switch analytics off for an environment.
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-HX19V58CGE";

export function Analytics() {
  /* Development traffic is not real traffic. Without this, every save, every
     hot reload and every local click lands in the same property as the numbers
     the business actually reads. A production build run locally (`npm run
     build && npm start`) does report, which is how to verify it works. */
  if (process.env.NODE_ENV !== "production") return null;
  if (!GA_MEASUREMENT_ID) return null;

  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
