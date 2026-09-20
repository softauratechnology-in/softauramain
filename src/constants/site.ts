/**
 * Company and site-wide constants.
 *
 * Contact details carried over from the original build and are real. Everything
 * else (social handles, address, registration) is marked `TODO` where the value
 * still needs to be supplied — those are deliberately left as `null` rather
 * than a plausible-looking placeholder, so a missing value fails visibly in
 * review instead of shipping as fake data.
 */

export const site = {
  /**
   * The company name is written `SoftAura` — one word, capital S, capital A.
   * Every rendered spelling on the site derives from this field and `shortName`
   * below, so the casing is fixed in one place. The lowercase form survives only
   * in the domain and email addresses, where it is part of the address itself.
   */
  name: "SoftAura Technology",
  /** Short form for the navbar wordmark. */
  shortName: "SoftAura",
  /** One-line positioning statement. Used in metadata and the footer. */
  tagline: "SaaS & enterprise product engineering",
  /* Doubles as the homepage meta description, so it is kept under 155
     characters — past that Google truncates it and the tail is wasted. It also
     feeds the Organization JSON-LD and llms.txt, which is why it names what we
     build rather than describing a posture. */
  description:
    "SoftAura Technology builds custom ERP systems, web applications, mobile apps and SaaS products for businesses across India and the UAE. Senior engineers only.",
  /**
   * Canonical origin. Overridden per-environment by `NEXT_PUBLIC_SITE_URL`;
   * the fallback keeps local builds and previews from emitting broken absolute
   * URLs in metadata and the sitemap.
   *
   * **The `www` is load-bearing.** Production serves from
   * `www.softauratechnology.com` and the apex 308-redirects to it. Every
   * canonical, `og:url`, sitemap entry, JSON-LD `@id` and `llms.txt` link on
   * the site derives from this one value — so while it said the bare apex, the
   * sitemap submitted to Search Console listed twenty-six URLs that all
   * redirected, and Google files those under "Page with redirect" instead of
   * indexing them.
   *
   * Fixed here rather than only in the Vercel environment on purpose: the
   * correct address is now the default, so forgetting the variable cannot
   * quietly reintroduce the mismatch. `NEXT_PUBLIC_SITE_URL` still wins when
   * set; it is simply no longer the only thing standing between the site and a
   * sitemap full of redirects.
   *
   * If the apex ever becomes primary, change this *and* the redirect together —
   * they have to agree.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.softauratechnology.com",
  /**
   * How the company describes *itself* as an entity, for the `Organization`
   * JSON-LD — as distinct from `description` above, which is the homepage meta
   * description.
   *
   * They are deliberately different lengths and registers. A meta description
   * is a sentence shown to a human deciding whether to click, and is judged on
   * the 140–160 characters Google will render. An entity description is read by
   * machines building a knowledge graph, where brevity and category terms
   * matter more than persuasion.
   *
   * Both must stay true of the same company. If one is edited, read the other.
   */
  entityDescription:
    "Enterprise product engineering agency specializing in custom SaaS, ERP systems, and web applications.",
  locale: "en_IN",
  /** Founded year, for the footer copyright range. */
  foundedYear: 2021,
} as const;

export const contact = {
  email: "contact@softauratechnology.com",
  /** Sales enquiries route to the same inbox until a dedicated alias exists. */
  salesEmail: "contact@softauratechnology.com",
  phones: [
    {
      label: "India",
      display: "+91 89400 66770",
      /** E.164, no punctuation — required by `tel:` and `wa.me`. */
      e164: "918940066770",
      /** ISO 3166-1 alpha-2, so the flag is data rather than a lookup by name. */
      country: "IN",
    },
    {
      label: "UAE",
      display: "+971 56 140 3767",
      e164: "971561403767",
      country: "AE",
    },
  ],
  /** Serviced regions, shown in the contact section. */
  regions: ["India", "United Arab Emirates"],
  /** Typical first-response time quoted on the contact form. */
  responseTime: "within one business day",
} as const;

export interface SocialLink {
  label: string;
  /** `null` until the real profile URL is supplied — renders nothing. */
  href: string | null;
}

/**
 * Social profiles. Entries with a `null` href are filtered out at render time
 * rather than shipped as dead `href="#"` links.
 */
export const socials: SocialLink[] = [
  { label: "LinkedIn", href: null }, // TODO: supply company LinkedIn URL
  { label: "GitHub", href: null }, // TODO: supply company GitHub org URL
  { label: "X", href: null }, // TODO: supply company X handle
  { label: "Dribbble", href: null }, // TODO: supply design portfolio URL
];

/** Only the socials that have a real destination. */
export const activeSocials = socials.filter(
  (social): social is SocialLink & { href: string } => social.href !== null,
);

/**
 * Public Google Business Profile listing — the Maps URL or a `g.page` short
 * link.
 *
 * Drives the "See all reviews on Google" link under the reviews section, which
 * is what lets a reader check the quotes against the source rather than taking
 * the site's word for them. `null` until the real URL is supplied: the link is
 * then omitted entirely rather than shipped pointing nowhere, the same
 * convention `socials` uses above.
 */
export const googleBusinessUrl: string | null = null; // TODO: supply GBP listing URL

/** WhatsApp deep links, derived so the number is never written twice. */
export const whatsappLinks = contact.phones.map((phone) => ({
  label: `WhatsApp — ${phone.label}`,
  href: `https://wa.me/${phone.e164}`,
  display: phone.display,
  /** The office this number reaches, for UI that groups by region. */
  region: phone.label,
  country: phone.country,
}));
