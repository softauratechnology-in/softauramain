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
  /*
   * TODO (assets): add `src/app/opengraph-image.tsx` (or a static
   * `opengraph-image.png`, 1200×630) for link previews. Next.js picks the file up
   * by convention — no metadata change needed here. Omitted rather than pointed at
   * a non-existent file, which would render a broken preview.
   */
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
         * Organisation structured data. Emitted as JSON-LD so search engines can
         * associate the brand, contact routes and service regions. Only facts that
         * are actually verified go in here.
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
              "@type": "Organization",
              name: site.name,
              url: site.url,
              description: site.description,
              email: contact.email,
              areaServed: contact.regions,
              contactPoint: contact.phones.map((phone) => ({
                "@type": "ContactPoint",
                telephone: `+${phone.e164}`,
                contactType: "sales",
                areaServed: phone.label,
                availableLanguage: ["en"],
              })),
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
