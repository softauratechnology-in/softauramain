/**
 * Location hubs — `/locations/[city]`.
 *
 * ## Why two pages and not sixteen
 *
 * The obvious move for local search is a page per city per service: "ERP
 * software development company in Chennai", "mobile app development company in
 * Chennai", and so on across both cities. Every competitor on these search
 * results does it.
 *
 * It is also the textbook definition of a **doorway page** — Google's spam
 * policy names "multiple pages targeting specific regions or cities that funnel
 * users to one page" explicitly, and it is an active penalty rather than a
 * missed opportunity. Sixteen near-identical pages with the place name swapped
 * is the exact pattern the policy describes.
 *
 * So: two substantial pages, one per city, each with content that is actually
 * about that city — different market, different buyers, different regulatory
 * context — linking out to the service and solution pages rather than
 * duplicating them.
 *
 * ## The address field
 *
 * `address` is `null` on both entries and must stay that way until a real,
 * registered address is supplied. Two reasons, and the second is the serious
 * one:
 *
 *  1. Name, address and phone have to match the Google Business Profile
 *     character-for-character. A near-miss is worse than an omission, because
 *     Google treats the two as separate entities and the local signal splits.
 *  2. Claiming a business address you do not hold is grounds for GBP
 *     suspension, and a suspended profile is far harder to recover than an
 *     unclaimed one.
 *
 * While it is `null`, the page and its structured data describe a service area
 * (`areaServed`) rather than a physical location, which is both accurate and
 * legitimate — Google supports service-area businesses as a first-class kind.
 */

import { contact } from "@/constants/site";
import type { FlagCode } from "@/components/ui/FlagIcon";

/** A postal address, once one is confirmed against the Business Profile. */
export interface LocationAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2. */
  addressCountry: string;
}

export interface Location {
  /** URL slug. */
  id: string;
  /** The city, as a reader would write it. */
  city: string;
  country: string;
  /** ISO 3166-1 alpha-2 — drives the flag and the schema. */
  countryCode: FlagCode;
  /** The page's one `<h1>`. */
  h1: string;
  /** Trailing phrase of `h1` to fill with the brand gradient. A suffix of it. */
  h1Accent: string;
  metaTitle: string;
  metaDescription: string;
  /** Direct answer. Quoted whole by answer engines, so it must stand alone. */
  intro: string;
  /** Why a buyer in this city specifically. Three or four. */
  highlights: { title: string; body: string }[];
  /** Neighbourhoods and nearby cities we genuinely serve from here. */
  areasServed: string[];
  faqs: { id: string; question: string; answer: string }[];
  /**
   * Postal address. `null` until confirmed against the Business Profile — see
   * the note at the top of this file before filling it in.
   */
  address: LocationAddress | null;
  /** Which of `contact.phones` belongs to this location, by label. */
  phoneLabel: string;
}

export const locations: Location[] = [
  {
    id: "chennai",
    city: "Chennai",
    country: "India",
    countryCode: "IN",
    h1: "Software development company in Chennai",
    h1Accent: "in Chennai",
    metaTitle: "Software Development Company in Chennai",
    metaDescription:
      "Custom software development in Chennai — ERP systems, web applications, mobile apps and school software. Senior engineers, and you own the code.",
    intro:
      "We are a software development company working with businesses and schools in Chennai, building custom ERP systems, web applications, mobile apps and e-commerce platforms. We work with organisations across Chennai and Tamil Nadu that have outgrown spreadsheets or off-the-shelf software, and we build systems they own outright rather than licence per user.",
    highlights: [
      {
        title: "We know the systems you already run",
        body: "Tally for accounts, UPI and Razorpay for payments, GST-compliant invoicing, and the state and CBSE reporting formats schools have to produce. Connecting to those is routine work here, not a special request.",
      },
      {
        title: "Built for Indian network conditions",
        body: "Systems that work on a patchy mobile connection and keep working when it drops, because a warehouse or a school office is not a fibre-connected desk. This is a build decision, and it is easier to make at the start than to retrofit.",
      },
      {
        title: "Meetings in your working day",
        body: "We work remotely as standard, and IST is our working day too — so a call is a call, not a scheduling negotiation. For Chennai clients we can meet in person when a project genuinely warrants it.",
      },
      {
        title: "You own what we build",
        body: "Source code, data and intellectual property transfer to you in writing on final payment. No per-user licence, and no dependency on us continuing to exist.",
      },
    ],
    areasServed: [
      "Chennai",
      "Ambattur",
      "Guindy",
      "OMR and Sholinganallur",
      "Porur",
      "T. Nagar",
      "Tambaram",
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli",
      "Tamil Nadu",
    ],
    faqs: [
      {
        id: "meet",
        question: "Do you work with clients in person in Chennai?",
        answer:
          "We work remotely as standard, with meetings by video call, and that is how the majority of our projects run. For Chennai clients we can meet in person where a project genuinely benefits — an initial scoping session, or walking a factory or school floor to understand a process before designing around it. Being remote by default is how we keep senior engineers on a project rather than whoever happens to be nearby.",
      },
      {
        id: "cost-chennai",
        question: "What does custom software development cost in Chennai?",
        answer:
          "Custom software in Chennai generally ranges from around ₹3 lakh for a focused web application to ₹40 lakh for an ERP spanning a whole organisation, with mobile apps commonly between ₹4 lakh and ₹12 lakh. Chennai rates sit below Bangalore and Mumbai for comparable senior work. We scope in detail and quote a fixed price per phase, so the figure you agree is the figure you pay.",
      },
      {
        id: "gst",
        question: "Do you handle GST invoicing and Tally integration?",
        answer:
          "Yes. GST-compliant invoicing is a standard requirement in almost every Indian ERP or e-commerce project we build, and pushing entries into Tally so your accountant keeps working in the software they know is one of our more common integrations. We set the mapping up during the build and you approve how each entry lands before it goes live.",
      },
    ],
    address: null, // TODO: supply the address exactly as registered on the GBP
    phoneLabel: "India",
  },

  {
    id: "dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    h1: "Software development company in Dubai",
    h1Accent: "in Dubai",
    metaTitle: "Software Development Company in Dubai",
    metaDescription:
      "Custom software development in Dubai and the UAE — ERP, web applications and mobile apps. VAT-ready, Arabic-capable, senior engineers. Fixed-price scoping.",
    intro:
      "We build custom software for businesses in Dubai and across the UAE — ERP systems, web applications, mobile apps and e-commerce platforms. We work with companies that need software shaped around their own operation rather than a licensed product they have to adapt to, and we deliver it at a cost structure that reflects our engineering base in India while keeping the working day aligned to Gulf hours.",
    highlights: [
      {
        title: "VAT and UAE compliance built in",
        body: "Five per cent VAT handling, compliant tax invoices and the record-keeping the FTA expects are part of how we build commercial systems here, rather than something added after an audit raises it.",
      },
      {
        title: "Arabic where you need it",
        body: "Right-to-left layouts and bilingual interfaces are a structural decision that is inexpensive at the start and expensive later. We will ask at scoping whether you need it, even if you have not thought about it yet.",
      },
      {
        title: "Gulf hours, and a number that answers",
        body: "IST is ninety minutes ahead of GST, so our working day and yours almost entirely overlap — unlike an offshore team eight hours behind you. We hold a UAE number and answer on it.",
      },
      {
        title: "Data residency handled deliberately",
        body: "Where your data has to stay in the UAE, we host it in-region and say so in writing. Where it does not, we will tell you what the choice actually costs rather than defaulting to the more expensive option.",
      },
    ],
    areasServed: [
      "Dubai",
      "Business Bay",
      "Deira",
      "Dubai Marina",
      "Jebel Ali",
      "Abu Dhabi",
      "Sharjah",
      "Ajman",
      "Ras Al Khaimah",
      "United Arab Emirates",
    ],
    faqs: [
      {
        id: "presence",
        question: "Do you have an office in Dubai?",
        answer:
          "We work with UAE clients remotely, with a UAE contact number and meetings by video call during Gulf working hours. Our engineering team is based in India, which is what allows us to deliver at a materially lower cost than a Dubai-based development firm for the same standard of work. We would rather state that plainly than imply a local office we do not operate.",
      },
      {
        id: "cost-dubai",
        question: "How much does custom software development cost in Dubai?",
        answer:
          "Custom software for UAE businesses typically runs from around AED 25,000 for a focused web application to AED 300,000 for a full ERP, with mobile apps commonly between AED 35,000 and AED 110,000. That is generally below what a Dubai-based agency quotes for equivalent scope, because our engineering costs are lower — not because the scope is smaller. We quote fixed price per phase after scoping.",
      },
      {
        id: "vat",
        question: "Will the system handle UAE VAT?",
        answer:
          "Yes. VAT at five per cent, compliant tax invoice formats, and the transaction records the Federal Tax Authority requires are built into any commercial system we deliver for the UAE. If your business operates across both the UAE and India, we handle the two tax regimes separately within one system rather than forcing a compromise between them.",
      },
      {
        id: "data",
        question: "Where will our data be stored?",
        answer:
          "Wherever you need it. We can host in a UAE region where data residency is a contractual or regulatory requirement for you, and we will confirm the hosting location in writing as part of the agreement. Where residency is not required, we will set out what the alternatives cost and let you decide rather than choosing on your behalf.",
      },
    ],
    address: null, // TODO: confirm whether a registered UAE address exists
    phoneLabel: "UAE",
  },
];

export function getLocation(slug: string): Location | undefined {
  return locations.find((location) => location.id === slug);
}

/** The phone for a location, resolved from the single source in `site.ts`. */
export function locationPhone(location: Location) {
  return contact.phones.find((phone) => phone.label === location.phoneLabel);
}
