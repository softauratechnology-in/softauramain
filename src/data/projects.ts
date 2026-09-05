export interface Project {
  /**
   * Stable key. Doubles as the URL slug for `/work/[slug]` — see
   * `caseStudyPath()` in `constants/navigation.ts`. Changing one breaks a live
   * URL, so treat it as permanent.
   */
  id: string;
  title: string;
  /** Client or sector line under the title. */
  client: string;
  /** Engagement type — rendered as the card's eyebrow label. */
  category: string;
  /** Two-to-three sentences: the problem, then what was delivered. */
  description: string;
  /**
   * Domain and engagement tags. These describe *what the work was*, which is
   * known. Technology claims live in `stack` and are only populated once
   * confirmed — see the note at the bottom of this file.
   */
  tags: string[];
  /** Confirmed technology used. `undefined` means "not yet confirmed". */
  stack?: string[];
  /**
   * Card artwork. See the artwork note at the bottom of this file before
   * changing any of these.
   */
  image: string;
  /** Alt text. Required: these images carry meaning on a work grid. */
  imageAlt: string;
  /**
   * Optional short, silent product clip played on hover over the card artwork.
   * Decorative — `image`/`imageAlt` remain the accessible representation.
   */
  video?: string;
  /** Live URL, when the client has agreed to be linked publicly. */
  url?: string;
  /** Larger card, first position in the grid. */
  featured?: boolean;

  /* — Case-study detail page (`/work/[slug]`) — */

  /** One line under the detail-page title. Plain language, no metrics. */
  summary: string;
  /** What was wrong before. The reader should recognise their own situation. */
  challenge: string[];
  /** What we built, in terms the buyer can evaluate. */
  approach: string[];
  /**
   * What changed, qualitatively.
   *
   * Deliberately no numbers: nothing here has been measured and signed off by
   * the client, and an invented percentage is the single fastest way to lose
   * the trust the rest of the site is trying to build. If a client approves a
   * real figure, add a `metrics` field — do not smuggle it into this prose.
   */
  outcome: string[];
}

/**
 * Case studies.
 *
 * Written from the facts on record about each engagement. No outcome metrics,
 * no invented client quotes, and no client named beyond what is already public.
 */
export const projects: Project[] = [
  {
    id: "school-erp",
    title: "School management system",
    client: "Private education group",
    category: "Custom ERP",
    description:
      "A single browser-based system replacing the spreadsheets and paper records three separate school offices were running independently. Parents, teachers and school owners each get their own view of the same academic, attendance and fee records.",
    summary:
      "One system for three school offices that had been running on spreadsheets, paper files and phone calls.",
    challenge: [
      "Three offices each kept their own records, so the same student could appear differently in each one and nobody could say which version was right.",
      "Fee collection was tracked by hand. Chasing an unpaid term meant cross-checking a spreadsheet against a receipt book.",
      "Parents phoned the office for things the office had to look up — attendance, marks, what was owed.",
      "Every report for the school owners was assembled manually, so it was out of date by the time it was read.",
    ],
    approach: [
      "One shared set of records for students, staff, attendance, marks and fees, so there is a single version of each.",
      "A different view for each role: office staff see administration, teachers see their own classes, parents see only their own child, owners see across all three schools.",
      "Fees tracked from invoice through to receipt, with the outstanding position visible without anyone assembling it.",
      "Reports the office can run themselves, rather than requesting them from us.",
    ],
    outcome: [
      "The three offices work from the same records instead of reconciling three sets.",
      "Parents can check attendance, results and fees themselves, which takes routine calls away from the office.",
      "School owners can see the current position across all three schools without waiting for someone to compile it.",
      "Adding a fourth school is a configuration change rather than a fourth spreadsheet system.",
    ],
    tags: ["School ERP", "Multi-role portal", "Education", "Web application"],
    /* Filename reads `venue-booking`; the file is this engagement's footage.
       See the artwork note at the bottom of this file before changing it. */
    image: "/case-studies/venue-booking.jpg",
    imageAlt:
      "A school portal shown in a browser window, with photographs of classrooms, teachers and parents",
    video: "/case-studies/venue-booking.mp4",
    featured: true,
  },
  {
    id: "akz-construction",
    title: "AKZ Construction corporate platform",
    client: "AKZ Construction Pvt Ltd, Dubai",
    category: "Web portal",
    description:
      "A corporate web presence for a Dubai construction contractor that needed to be credible to enterprise procurement teams, not just attractive. Capability, project history and company profile are structured so a prospective partner can qualify the firm in a single visit.",
    summary:
      "A web portal for a Dubai construction contractor, built to satisfy procurement teams rather than just look good.",
    challenge: [
      "Large contracts in the region are awarded after a procurement team has checked a firm can actually deliver at the required scale — and that check often starts with the website.",
      "The company's capability, completed projects and credentials existed, but were spread across documents rather than presented anywhere a prospective partner could find them.",
      "The audience is international: a first visit could come from anywhere, and often outside working hours.",
    ],
    approach: [
      "Structured the site around the questions a procurement team asks first: what you build, at what scale, and what you have completed.",
      "Project history presented as evidence — the work itself, rather than marketing claims about it.",
      "Company profile and credentials in one place, so a qualifying visitor is not sent looking for a PDF.",
      "Fast to load and readable on a phone, since a site that stalls reads as a firm that will.",
    ],
    outcome: [
      "A prospective partner can assess the firm in a single visit instead of requesting a capability document.",
      "Enquiries arrive with context, because the site has already answered what the firm does and at what scale.",
      "The company controls how it is presented to procurement, rather than relying on directory listings.",
    ],
    tags: ["Corporate site", "Construction", "Dubai", "Brand"],
    image: "/case-studies/profile_image.png",
    imageAlt:
      "Steel-frame building under construction, surrounded by tower cranes against a clear sky",
    video: "/case-studies/IMG_0379.MP4",
  },
  {
    id: "venue-booking",
    title: "Event venue booking site",
    client: "Marriage hall & events venue",
    category: "Website & enquiries",
    description:
      "A marketing and enquiry site for a wedding and events venue. The space, amenities and availability are presented so couples and event organisers can assess fit quickly, with enquiry capture as the single conversion path.",
    summary:
      "A site for a wedding and events venue, built around one job: turning a browsing couple into an enquiry.",
    challenge: [
      "Couples compare venues on photographs and practicalities — capacity, catering, parking — and leave immediately if those are hard to find.",
      "Enquiries were arriving across several channels with different details each time, so following them up was inconsistent.",
      "Most of the browsing happens on a phone, often in the evening, long after anyone is at the venue to answer.",
    ],
    approach: [
      "Led with the space itself, so a visitor can judge fit before reading anything.",
      "Put the practical questions — capacity, what is included, where it is — where they are asked, not on a separate page.",
      "One clear enquiry path, capturing the details the venue actually needs to reply usefully.",
      "Built for a phone first, because that is where the decision is being made.",
    ],
    outcome: [
      "Enquiries arrive with the details needed to respond properly, rather than starting a back-and-forth.",
      "Couples can assess the venue outside office hours without waiting for a callback.",
      "The venue has one place to point every listing, advertisement and referral at.",
    ],
    tags: ["Marketing site", "Hospitality", "Lead capture"],
    /* Filename reads `school-erp`; the file is the stock laptop shot. Generic —
       worth replacing with real venue artwork when there is some. */
    image: "/case-studies/school-erp.jpg",
    imageAlt:
      "A person working at a laptop, with a dashboard shown on a floating screen beside them",
    video: "/case-studies/school-erp.mp4",
  },
];

/*
 * TODO (content): three things are outstanding on this data set and each is
 * client-supplied rather than something that should be guessed:
 *   1. `stack` — the confirmed technology per engagement.
 *   2. `url`   — public links, where the client agrees to be referenced.
 *   3. `image` — real product screenshots (see below).
 * The UI renders correctly with all three absent, so this is safe to ship and
 * fill in incrementally.
 */

/*
 * ARTWORK NOTE — the filenames do not match their contents.
 *
 * This is why the `image` paths above look crossed. They are not: each entry
 * points at the file whose *content* belongs to it. Verified by opening each
 * one. Renaming a file without updating the reference here (or the reverse)
 * would silently swap two case studies' artwork, so change both together.
 *
 *   school-erp.jpg/.mp4     → person at a laptop, floating dashboard.
 *                             Used by `venue-booking`.
 *   venue-booking.jpg/.mp4  → browser window showing the school portal.
 *                             Used by `school-erp`.
 *   profile_image.png       → steel-frame building under construction.
 *                             Used by `akz-construction`.
 *
 * Renaming these three files to match their subjects would be a worthwhile
 * tidy-up on a quiet day.
 *
 * Quality, when replacements are available: the two `.mp4`-derived stills are
 * screen recordings rather than clean product captures — browser chrome, a
 * taskbar and a webcam bubble are in frame on the school one. And the venue
 * entry's artwork is generic stock with nothing to do with a venue. Neither is
 * blocking; both would be improved by a real screenshot.
 */

export const featuredProject = projects.find((project) => project.featured);

/** Look one up by URL slug. `undefined` drives `notFound()` on the detail route. */
export const getProject = (slug: string): Project | undefined =>
  projects.find((project) => project.id === slug);
