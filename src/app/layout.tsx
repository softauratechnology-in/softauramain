import type { Metadata, Viewport } from "next";
import { Geist, Syne } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { Analytics } from "@/components/Analytics";
import { site, contact } from "@/constants/site";
import { semantic } from "@/styles/colors";
import { ACTIVE_THEME, isLightTheme } from "@/styles/themes";

/**
 * Root layout.
 *
 * Fonts are loaded through `next/font`, which self-hosts them at build time — no
 * runtime request to Google, and `display: "swap"` so text is never invisible
 * while a face downloads.
 *
 * Syne is requested at only the three weights the design uses; each extra weight
 * is another font file on the critical path.
 */

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  /* `metadataBase` makes every relative URL below resolve to an absolute one in
     OG/Twitter tags, which crawlers require. */
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    /* Applied to every child route's own title. */
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "SaaS development company",
    "enterprise web application development",
    "custom software development",
    "AI integration services",
    "cloud architecture",
    "product engineering",
    "Next.js development",
    "software company India",
    "software company UAE",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  /* Link previews come from `src/app/opengraph-image.tsx`, which Next picks up
     by file convention — no `openGraph.images` entry belongs here, and adding
     one would override the generated card with nothing. `/work/[slug]` sets its
     own and takes precedence. */
};

export const viewport: Viewport = {
  themeColor: semantic.background,
  /* Follows the active preset — the browser tints form controls and scrollbars
     from this, so a light preset must not claim to be dark. */
  colorScheme: isLightTheme(ACTIVE_THEME) ? "light" : "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* `data-theme` is rendered on the server, so the canvas colour is correct
       in the very first paint — no light-flash before hydration. Override it on
       any subtree to run one section in a different preset. */
    <html
      lang="en"
      data-theme={ACTIVE_THEME}
      className={`${geist.variable} ${syne.variable} antialiased`}
    >
      <body className="bg-background text-foreground">
        {/*
         * No-JavaScript fallback.
         *
         * The reveal animations render their *initial* state on the server, so
         * the SSR'd HTML carries an inline `opacity:0` on a few dozen elements
         * per page — Framer clears them on hydration. The text is in the DOM
         * either way, so crawlers are unaffected, but a reader whose JavaScript
         * is blocked, slow, or broken by a hydration error sees a blank page.
         *
         * Inline styles beat stylesheets, so this needs `!important`. The two
         * selectors are deliberate: `opacity:0;` catches a value followed by
         * another property, `$=` catches it as the last one. Matching a bare
         * `opacity:0` substring would also hit `opacity:0.5` and flatten the
         * hero's blurred colour fields, which are meant to be translucent.
         */}
        <noscript>
          <style>{`[style*="opacity:0;"],[style$="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/*
         * Site-wide structured data, as a linked `@graph` rather than two loose
         * blocks. The `@id` values are what tie them together: the `WebSite`
         * names the `Organization` as its publisher instead of restating the
         * company, so a search engine reads one entity described twice rather
         * than two that happen to share a name. Per-page schema — `FAQPage` on
         * /faq, `BreadcrumbList` on a case study — points at the same ids.
         *
         * Only verified facts. No `aggregateRating`: Google treats self-serving
         * review markup on an `Organization` as ineligible for the star
         * feature, and the reasoning is recorded in `data/reviews.ts`.
         */}
        {/*
         * `.replace(/</g, "\\u003c")` below: `JSON.stringify` does not escape
         * markup, so a `<` in any of this data would close the script tag early.
         * The escape is what the Next.js JSON-LD guide prescribes.
         */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${site.url}/#organization`,
                  name: site.name,
                  url: site.url,
                  description: site.description,
                  email: contact.email,
                  foundingDate: String(site.foundedYear),
                  areaServed: contact.regions,
                  knowsAbout: [
                    "Custom software development",
                    "SaaS product engineering",
                    "Enterprise resource planning",
                    "School management systems",
                    "Mobile application development",
                    "E-commerce development",
                  ],
                  contactPoint: contact.phones.map((phone) => ({
                    "@type": "ContactPoint",
                    telephone: `+${phone.e164}`,
                    contactType: "sales",
                    areaServed: phone.label,
                    availableLanguage: ["en"],
                  })),
                },
                {
                  "@type": "WebSite",
                  "@id": `${site.url}/#website`,
                  url: site.url,
                  name: site.name,
                  description: site.description,
                  inLanguage: "en",
                  publisher: { "@id": `${site.url}/#organization` },
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />

        <MotionProvider>
          <Navbar />
          {children}
          <Footer />
          {/* Persistent across routes, so it lives here rather than per-page. */}
          <WhatsAppWidget />
        </MotionProvider>

        {/* Mounted once, here, for the whole site — Google's "paste it into
            every page" instruction would load `gtag.js` on every route. Renders
            nothing outside production; see the notes in the component. */}
        <Analytics />
      </body>
    </html>
  );
}
