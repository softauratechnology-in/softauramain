import type { Metadata, Viewport } from "next";
import { Geist, Syne } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { GreetingProvider } from "@/components/greeting/GreetingProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Analytics } from "@/components/Analytics";
import { site, contact, activeSocials, googleBusinessUrl } from "@/constants/site";
import { landingPages } from "@/data/landingPages";
import { locations } from "@/data/locations";
import { absolute } from "@/lib/schema";
import { landingPath } from "@/constants/navigation";
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
  /*
   * Worth knowing what this is and is not. Google has ignored the keywords meta
   * entirely since 2009 and says so publicly; Bing treats it as a spam signal
   * when it is stuffed. It is kept because some smaller engines and a few AI
   * crawlers still read it, and because an accurate short list costs nothing.
   *
   * So it is a *description*, not a bid: every term here is one this site has a
   * real page answering. The ranking work is done by those pages, not by this.
   */
  keywords: [
    "custom software development company",
    "website development company",
    "web application development",
    "mobile app development company",
    "ERP software development company",
    "school management software",
    "inventory management software",
    "HR and people management software",
    "e-commerce website development",
    "software development company in Chennai",
    "software development company in Dubai",
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
                  /* Derived from the landing pages, so the entity's claimed
                     expertise and the site's actual pages cannot drift apart.
                     Claiming knowledge of something with no page behind it is
                     the kind of small inconsistency that costs trust in an
                     entity graph. */
                  knowsAbout: landingPages.map((page) => page.keyword),
                  /* Every place we say we serve, from one source. */
                  areaServed: locations.flatMap((location) =>
                    location.areasServed.map((area) => ({
                      "@type": "Place",
                      name: area,
                    })),
                  ),
                  /*
                   * Entity disambiguation.
                   *
                   * Four other businesses currently rank for "SoftAura" —
                   * softaura.dev, softaurasolutions.com, softauras.com and
                   * Softura — and a search engine has no way to tell which
                   * pages belong to which company from the name alone.
                   * `sameAs` is how you assert "these profiles are also us".
                   *
                   * Emitted only when a real URL exists. `socials` and
                   * `googleBusinessUrl` in `constants/site.ts` are still
                   * `null`, so today this renders nothing rather than a
                   * fabricated profile link — which would be worse than the
                   * ambiguity it is meant to resolve. Fill those in and this
                   * starts working with no change here.
                   */
                  ...(() => {
                    const profiles = [
                      googleBusinessUrl,
                      ...activeSocials.map((social) => social.href),
                    ].filter((href): href is string => Boolean(href));
                    return profiles.length > 0 ? { sameAs: profiles } : {};
                  })(),
                  /* The catalogue, as entities rather than prose. This is what
                     lets an answer engine say what we do without inferring it
                     from marketing copy. */
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Software development services",
                    itemListElement: landingPages.map((page) => ({
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        "@id": `${absolute(landingPath(page.section, page.id))}/#service`,
                        name: page.title,
                        serviceType: page.keyword,
                      },
                    })),
                  },
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
          {/* Inside MotionProvider so greeting animations inherit the global
              reduced-motion clamp. */}
          <GreetingProvider>
            <Navbar />
            {children}
            <Footer />
            {/* Persistent across routes, so it lives here rather than per-page. */}
            <WhatsAppWidget />
            {/* Sits directly above the WhatsApp launcher in the same corner
                column. See the stacking note in the component. */}
            <ChatWidget />
          </GreetingProvider>
        </MotionProvider>

        {/* Mounted once, here, for the whole site — Google's "paste it into
            every page" instruction would load `gtag.js` on every route. Renders
            nothing outside production; see the notes in the component. */}
        <Analytics />
      </body>
    </html>
  );
}
