export interface Project {
  /** Stable key and anchor fragment. */
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
   * Card artwork. Placeholder gradients live in `public/case-studies/` — replace
   * with real product screenshots when available.
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
}

/**
 * Case studies.
 *
 * Descriptions are written from the facts on record about each engagement. No
 * outcome metrics are quoted because none have been supplied and measured —
 * add a `metrics` field here only with numbers the client has approved.
 */
export const projects: Project[] = [
  {
    id: "school-erp",
    title: "School management ERP platform",
    client: "Private education group",
    category: "Enterprise web application",
    description:
      "A single browser-based system replacing the spreadsheets and paper records three separate school offices were running independently. Parents, teachers and school owners each get a role-scoped portal over shared academic, attendance and fee data.",
    tags: ["ERP", "Multi-role portal", "Education", "Web application"],
    /* Poster frame lifted from the product clip below, so the still and the
       hover video are the same shot — no colour jump when playback starts. */
    image: "/case-studies/venue-booking.jpg",
    imageAlt:
      "School administrator working at a laptop with the ERP dashboard shown on a floating screen",

    featured: true,
     video: "/case-studies/venue-booking.mp4",
  },
  {
    id: "akz-construction",
    title: "AKZ Construction corporate platform",
    client: "AKZ Construction Pvt Ltd, Dubai",
    category: "Website design & development",
    description:
      "A corporate site for a Dubai construction firm that needed to be credible to enterprise procurement teams, not just attractive. Service capability, project history and company profile are structured so a prospective partner can qualify the firm in a single visit.",
    tags: ["Corporate site", "Construction", "Dubai", "Brand"],
  
    image:"/case-studies/profile_image.png",
    imageAlt:
      "Abstract gradient artwork representing the AKZ Construction corporate website",
      video:"/case-studies/IMG_0379.MP4"
  },
  {
    id: "venue-booking",
    title: "Event venue booking site",
    client: "Marriage hall & events venue",
    category: "Website design & development",
    description:
      "A marketing and enquiry site for a wedding and events venue. The space, amenities and availability are presented so couples and event organisers can assess fit quickly, with enquiry capture as the single conversion path.",
    tags: ["Marketing site", "Hospitality", "Lead capture"],
    image: "/case-studies/school-erp.jpg",
    imageAlt:
      "Abstract gradient artwork representing the event venue booking website",
    video: "/case-studies/school-erp.mp4",
  },
];

/*
 * TODO (content): three things are outstanding on this data set and each is
 * client-supplied rather than something that should be guessed:
 *   1. `stack` — the confirmed technology per engagement.
 *   2. `url`   — public links, where the client agrees to be referenced.
 *   3. `image` — real product screenshots to replace the placeholder gradients.
 * The UI renders correctly with all three absent, so this is safe to ship and
 * fill in incrementally.
 */

export const featuredProject = projects.find((project) => project.featured);
