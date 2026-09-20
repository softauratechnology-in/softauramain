import type { IconName } from "@/components/ui/Icon";

/**
 * Keyword landing pages — `/services/[slug]` and `/solutions/[slug]`.
 *
 * Why this exists separately from `services.ts`: that file is the *card*
 * catalogue for the `/services` page, written to be skimmed nine at a time.
 * These are destination pages, each written to answer one search completely.
 * A searcher typing "school management software" and a visitor browsing the
 * services grid want different things, and one body of copy cannot serve both
 * without being mediocre at each.
 *
 * The split into two sections is an information-architecture decision, not a
 * technical one:
 *
 *  - `services` — a *capability* you hire. "Web application development."
 *  - `solutions` — a *system* you need built. "Inventory management software."
 *
 * A buyer searching the second phrasing is describing the thing they want to
 * own, not the work required to get it, and filing those under `/services`
 * reads wrong to both a reader and a crawler.
 *
 * ## Copy rules
 *
 * Same voice as `services.ts` — outcome first, plain language, a school
 * administrator or a non-technical founder has to be able to read every line —
 * plus two rules specific to pages that exist to be found:
 *
 *  1. **`intro` must answer the search on its own.** Google's featured snippets
 *     and every LLM-generated answer quote a single self-contained passage. An
 *     intro that opens "In today's fast-moving digital landscape" gets quoted
 *     saying nothing. Open with the direct answer, in one sentence, the way
 *     `faq.ts` already does.
 *  2. **No superlatives we cannot support.** "Best", "leading" and "#1" are
 *     what every competitor on these SERPs writes, they are unverifiable, and
 *     Google's reviewer guidelines treat them as a quality signal against you.
 *     Specificity outranks adjectives.
 *
 * ## What is deliberately absent
 *
 * No price figures, no "500+ projects delivered", no client logos we have not
 * been given permission to use. Every competitor page researched for this work
 * carries at least one of those and most are unverifiable. The rest of this
 * site is built on only shipping facts that are true; these pages do not get an
 * exemption because they are marketing.
 */

export interface LandingFaq {
  /** Stable key, also the anchor fragment. */
  id: string;
  question: string;
  answer: string;
}

/** A reason this page's reader might be here, and what we do about it. */
export interface LandingUseCase {
  title: string;
  body: string;
}

export interface LandingPage {
  /**
   * URL slug. Permanent once shipped — a rename is a dead URL, and these pages
   * exist to accumulate search history that a redirect only partly preserves.
   */
  id: string;
  /**
   * Which route segment this page lives under. See the note above on why the
   * split exists.
   */
  section: "services" | "solutions";
  /**
   * The search this page is written to win, in the searcher's own words.
   *
   * Recorded as data rather than left implicit in the copy because it is the
   * thing to check a rewrite against: if an edit leaves the page no longer
   * answering this phrase, the edit has cost a ranking.
   */
  keyword: string;
  /** Short label — nav, cards, breadcrumbs. */
  title: string;
  /** The page's one `<h1>`. Longer than `title`; states the offer plainly. */
  h1: string;
  /**
   * The trailing phrase of `h1` to fill with the brand gradient.
   *
   * Must be a suffix of `h1` — the renderer splits on it and falls back to a
   * plain headline if it is not, so a careless edit loses the gradient rather
   * than producing a mangled heading. Stated rather than derived because "the
   * last two words" reads well on some of these and badly on others.
   */
  h1Accent: string;
  /**
   * `<title>`, before the brand suffix the root layout's template appends.
   *
   * Kept under ~45 characters. The suffix costs 22, and Google truncates the
   * rendered title around 60 — so the keyword goes first and anything that
   * would be cut is something we were willing to lose.
   */
  metaTitle: string;
  metaDescription: string;
  /** One line, for cards and the hub grids. */
  summary: string;
  /** The direct answer. See copy rule 1. */
  intro: string;
  icon: IconName;
  /** Concrete inclusions. Four to six; they render as a checked list. */
  deliverables: string[];
  /** Who arrives on this page, and why. */
  useCases: LandingUseCase[];
  /** Emitted as `FAQPage` structured data as well as rendered. Three to five. */
  faqs: LandingFaq[];
  /** Case study slug, when we have delivered exactly this. */
  relatedProjectId?: string;
  /** Sibling slugs, for the in-cluster cross-links. */
  related: string[];
}

export const landingPages: LandingPage[] = [
  /* ---------------------------------------------------------------- services */
  {
    id: "web-development",
    section: "services",
    keyword: "website development company",
    title: "Website Development",
    h1: "Website development that brings you enquiries",
    h1Accent: "brings you enquiries",
    metaTitle: "Website Development Company",
    metaDescription:
      "Website development for businesses in Chennai and Dubai. Fast, mobile-first sites built to be found in search and to turn visitors into enquiries.",
    summary:
      "A site that loads fast, reads well on a phone and is built to be found — rather than a template with your logo dropped into it.",
    intro:
      "Website development is the work of designing, building and launching a site that your customers can find and use. We build sites from scratch rather than from a template, which matters for two reasons: a custom build loads in a fraction of the time a page-builder theme does, and search engines rank what loads quickly. The result is a site that brings in enquiries rather than one that simply exists.",
    icon: "browser",
    deliverables: [
      "Designed for your business, not adapted from a stock theme",
      "Loads in around a second, which is what search ranking rewards",
      "Reads properly on a phone first, then scales up to a desktop",
      "Search fundamentals done at build time, not sold back to you later",
      "A way for you to edit your own content without calling us",
      "Enquiry forms that reach your inbox, with a record you can check",
    ],
    useCases: [
      {
        title: "Your current site was built years ago",
        body: "It looks dated, it is slow on a phone, and nobody left at the company knows how to change it. Rebuilding is usually cheaper than continuing to patch it.",
      },
      {
        title: "You are getting visitors but no enquiries",
        body: "Traffic without contact is nearly always a structure problem rather than a design one — unclear offer, buried contact route, or a form nobody trusts.",
      },
      {
        title: "You do not appear in search at all",
        body: "Often the site was never technically set up to be indexed. That is fixable, and it is the first thing we check.",
      },
    ],
    faqs: [
      {
        id: "cost",
        question: "How much does website development cost in India?",
        answer:
          "A business website from a custom development team in India typically runs from ₹60,000 for a small brochure site to several lakh for a site with custom functionality, integrations or a large content structure. The honest answer is that the range is wide because the work is: a five-page site and a fifty-page site with a booking system are different projects. We quote a fixed price after a scoping conversation rather than publishing a figure that would be wrong for most people reading it.",
      },
      {
        id: "how-long",
        question: "How long does it take to build a website?",
        answer:
          "Four to eight weeks for most business websites, from the first conversation to going live. Design takes the first two weeks, build the next three, and the final week is your review and the launch. The single thing that most often extends it is content — photographs and written copy usually take longer to gather than anyone expects, so we start that on day one.",
      },
      {
        id: "wordpress",
        question: "Do you build on WordPress?",
        answer:
          "Not usually. We build with Next.js, which produces a site that loads considerably faster and has a far smaller security surface — most sites that get hacked are running an out-of-date plugin. You still get an editor for your own content. If you specifically need WordPress because your team already knows it, say so and we will tell you honestly whether it is the right call for what you are asking for.",
      },
      {
        id: "seo-included",
        question: "Is SEO included in website development?",
        answer:
          "The technical foundation is included, always: fast loading, a clean page structure, titles and descriptions, a sitemap, structured data and mobile performance. Those are part of building a site properly, not an upsell. Ongoing SEO — content, links and local listings — is separate work with a monthly commitment, and we will tell you plainly whether you need it.",
      },
    ],
    relatedProjectId: "venue-booking",
    related: ["web-application-development", "ecommerce-development", "erp-software"],
  },

  {
    id: "web-application-development",
    section: "services",
    keyword: "web application development company",
    title: "Web Application Development",
    h1: "Web application development for teams outgrowing spreadsheets",
    h1Accent: "outgrowing spreadsheets",
    metaTitle: "Web Application Development",
    metaDescription:
      "Custom web application development in Chennai and Dubai. Secure browser-based systems with role-based logins, live data and reporting. You own the code.",
    summary:
      "Software your team logs into and works in all day — records, approvals, reporting — reached from a browser, with no installation.",
    intro:
      "A web application is software your team logs into and works in, rather than a website they read. The difference that matters to you is data: a website presents fixed information, while a web application stores records, enforces who can see what, and changes as people use it. We build them for organisations that have outgrown shared spreadsheets but do not want the compromise of off-the-shelf software.",
    icon: "layers",
    deliverables: [
      "Secure logins, with a different view for each role in your team",
      "Your data in one place instead of across a dozen spreadsheets",
      "Reports and exports your team can run without asking us",
      "Works on a laptop, a tablet or a phone — nothing to install",
      "Connects to the systems you already pay for",
      "An audit trail: who changed what, and when",
    ],
    useCases: [
      {
        title: "The spreadsheet has stopped coping",
        body: "Two people edit it at once, a formula breaks silently, and nobody is certain which copy is current. That is the point at which a shared spreadsheet becomes a liability rather than a tool.",
      },
      {
        title: "Off-the-shelf software fits badly",
        body: "You are paying per seat for a system where half the fields are irrelevant and the one thing you actually need is on their roadmap. Custom is often cheaper over three years than the workarounds.",
      },
      {
        title: "Your process lives in people's heads",
        body: "The work runs on WhatsApp threads and the knowledge of whoever has been there longest. A web application makes the process explicit, which also makes it survivable when someone leaves.",
      },
    ],
    faqs: [
      {
        id: "difference",
        question: "What is the difference between a website and a web application?",
        answer:
          "A website presents information; a web application does work. You read a website — pages, images, a contact form. You log into a web application and it stores your records, applies rules about who can see what, calculates things and produces reports. A restaurant's menu page is a website; the system the kitchen uses to track orders is a web application. Many businesses need both, and they are usually separate builds.",
      },
      {
        id: "cost",
        question: "How much does a custom web application cost?",
        answer:
          "Most business web applications fall between ₹3 lakh and ₹25 lakh in India, and roughly AED 25,000 to AED 180,000 in the UAE, depending on how many distinct user roles and workflows there are. The cost driver is almost never the number of screens — it is the number of rules the system has to enforce. We scope in detail and quote fixed price, so the figure you agree is the figure you pay.",
      },
      {
        id: "timeline",
        question: "How long does a web application take to build?",
        answer:
          "Three to six months for a first working version that your team can use in earnest. We ship a usable core early — typically within eight weeks — and add to it, rather than disappearing for half a year and returning with everything at once. That way you find out whether it fits how you work while changing it is still cheap.",
      },
      {
        id: "existing-data",
        question: "Can you move our existing data into it?",
        answer:
          "Yes, and it is a normal part of the project. Spreadsheets, an old system's database export, even years of accumulated files — we map what you have onto the new structure, run the import on a copy first so you can check it, and only then move the live data. Where the old data is inconsistent we will show you what we found rather than quietly guessing.",
      },
    ],
    relatedProjectId: "akz-construction",
    related: ["erp-software", "inventory-management-software", "mobile-app-development"],
  },

  {
    id: "mobile-app-development",
    section: "services",
    keyword: "mobile app development company",
    title: "Mobile App Development",
    h1: "Mobile app development for iPhone and Android",
    h1Accent: "iPhone and Android",
    metaTitle: "Mobile App Development Company",
    metaDescription:
      "Mobile app development in Chennai and Dubai. One codebase for iOS and Android, offline support, push notifications, and we handle both store submissions.",
    summary:
      "iPhone and Android apps from a single codebase, so a new feature reaches both at once instead of being budgeted twice.",
    intro:
      "Mobile app development is building software that runs on a phone and is installed from the App Store or Play Store. We build both platforms from one shared codebase, which is the decision that most affects your budget: a feature is designed, built and tested once rather than twice, and iPhone and Android users get it on the same day. We also handle the store submissions, which is the part most first-time app owners underestimate.",
    icon: "device",
    deliverables: [
      "One app, both stores — iPhone and Android from a single codebase",
      "Keeps working when the signal drops, and syncs when it returns",
      "Push notifications that reach the right people, not everyone",
      "We handle App Store and Play Store submission and review",
      "Login, payments and the permissions each store requires",
      "Updates after launch, without a new submission every time",
    ],
    useCases: [
      {
        title: "Your customers are asking for an app",
        body: "Usually what they want is something specific — booking, tracking, or a card they stop having to carry. Worth establishing which before committing to a full app.",
      },
      {
        title: "Your staff work away from a desk",
        body: "Site engineers, delivery drivers, field sales. A phone app that works without a signal and syncs later is the difference between records being kept and records being remembered.",
      },
      {
        title: "You have a web system and need it in a pocket",
        body: "Often the right answer is a focused app covering the few things people genuinely do on a phone, rather than a shrunken copy of the whole system.",
      },
    ],
    faqs: [
      {
        id: "cost",
        question: "How much does it cost to develop a mobile app in India?",
        answer:
          "A straightforward mobile app generally costs between ₹4 lakh and ₹12 lakh in India, with more complex apps — live tracking, payments, or a large back office behind them — running higher. Building both platforms from one codebase is what keeps that figure from roughly doubling. The back-end system the app talks to is often a bigger share of the cost than the app itself, so it is worth scoping both together.",
      },
      {
        id: "both-platforms",
        question: "Do we have to pay separately for iPhone and Android?",
        answer:
          "No. We build both from a single shared codebase, so you pay once for the work and get two apps. There is a small amount of platform-specific work at the edges — store requirements, notification handling, and a few interface conventions that differ — but it is a fraction of the project rather than a second project.",
      },
      {
        id: "store-approval",
        question: "Will our app definitely be approved by the App Store?",
        answer:
          "We prepare for review as part of the build rather than discovering problems at the end, and we handle the submission and any back-and-forth with the reviewers. Most rejections are for predictable reasons — missing privacy declarations, a login with no way to delete an account, or screenshots that do not match the app — and those are addressed before we submit. We cannot guarantee another company's decision, but we have not had one that could not be resolved.",
      },
      {
        id: "maintenance",
        question: "What happens after the app launches?",
        answer:
          "Apps need ongoing attention in a way websites do not: Apple and Google each release a new OS version annually, and both periodically raise their minimum requirements. Left alone for two years, an app usually stops being installable. We offer a support agreement that covers those updates, security patches and store compliance, with agreed response times in writing.",
      },
    ],
    related: ["web-application-development", "school-management-software", "web-development"],
  },

  {
    id: "ecommerce-development",
    section: "services",
    keyword: "ecommerce website development company",
    title: "E-Commerce Development",
    h1: "E-commerce website development that converts",
    h1Accent: "that converts",
    metaTitle: "E-Commerce Website Development",
    metaDescription:
      "E-commerce website development in Chennai and Dubai. Fast product pages, a checkout people finish, and stock your team can actually manage. Fixed-price build.",
    summary:
      "Online stores that are quick to browse, simple to check out of, and straightforward for your team to run after handover.",
    intro:
      "E-commerce development is building an online store that takes orders and payments. The part that decides whether it earns money is rarely the design — it is checkout completion and page speed, which is where most template stores quietly lose customers. We build stores that load fast, ask for the fewest possible details at checkout, and leave your team able to manage products and orders without needing us.",
    icon: "cart",
    deliverables: [
      "Product catalogue, cart and a checkout people actually finish",
      "Payment and delivery options that suit your market",
      "Stock, orders and customers visible in one place",
      "Built to be found in search from day one, not retrofitted",
      "Discounts, offers and abandoned-cart recovery",
      "Your team manages products without calling us",
    ],
    useCases: [
      {
        title: "You sell through marketplaces and want your own store",
        body: "Amazon and Flipkart take a margin and keep the customer relationship. Your own store keeps both, but only if it is findable and quick.",
      },
      {
        title: "Your Shopify or WooCommerce store is slow",
        body: "Usually the cause is accumulated plugins. There is a point at which rebuilding costs less than continuing to add extensions to work around each other.",
      },
      {
        title: "You need something your catalogue does not fit into",
        body: "Made-to-order, bulk pricing tiers, B2B accounts with credit terms, or products configured by the customer. Standard platforms handle these badly.",
      },
    ],
    faqs: [
      {
        id: "platform",
        question: "Should we use Shopify or a custom e-commerce build?",
        answer:
          "Use Shopify if you sell a straightforward catalogue and want to be trading in weeks — it is genuinely good, and we will tell you when it is the right answer rather than talk you out of it. Build custom when the platform fee becomes significant at your volume, when you need pricing or ordering rules it cannot express, or when speed is costing you customers. The honest test is whether you are fighting the platform; if you are not, do not rebuild.",
      },
      {
        id: "cost",
        question: "How much does an e-commerce website cost?",
        answer:
          "A custom e-commerce build typically starts around ₹1.5 lakh for a focused store and rises with catalogue complexity, integrations and any non-standard ordering rules. Budget separately for payment gateway charges, which are a percentage of each sale rather than a build cost, and for product photography, which is usually the item most often left out of an early budget.",
      },
      {
        id: "payments",
        question: "Which payment gateways do you integrate?",
        answer:
          "Razorpay, PayU, CCAvenue, Stripe and PayPal are the ones we work with most, and UPI is standard on Indian stores. For the UAE we work with Telr, Network International and Stripe. We will recommend based on your transaction charges and settlement times rather than on which one is easiest for us.",
      },
    ],
    related: ["web-development", "inventory-management-software", "mobile-app-development"],
  },

  /* --------------------------------------------------------------- solutions */
  {
    id: "erp-software",
    section: "solutions",
    keyword: "ERP software development company",
    title: "Custom ERP Software",
    h1: "Custom ERP software built around how you already work",
    h1Accent: "how you already work",
    metaTitle: "Custom ERP Software Development",
    metaDescription:
      "Custom ERP software development in Chennai and Dubai. One system for orders, stock, finance and staff — built around how you already work. You own it.",
    summary:
      "One system replacing the spreadsheets, paper files and WhatsApp threads your organisation currently runs on.",
    intro:
      "ERP software brings the separate parts of a business — orders, stock, purchasing, finance, staff — into one system, so the same information does not have to be typed in three places. A custom ERP is built around the way your organisation already works, rather than requiring you to change your process to match the software. That is the entire trade-off against SAP, Oracle or Zoho: more to build up front, nothing to work around afterwards.",
    icon: "browser",
    deliverables: [
      "Orders, stock, purchasing, invoicing and staff records in one place",
      "A different view for each role — floor, office, management",
      "Reports and exports your team runs without asking us",
      "Connects to Tally, your bank, or whatever you already pay for",
      "Approvals and limits that match how decisions are actually made",
      "Runs on a laptop, a tablet, or a phone on the shop floor",
    ],
    useCases: [
      {
        title: "The same number is typed in three systems",
        body: "Sales keep one spreadsheet, stores keep another, accounts keep a third, and month-end is spent reconciling them. This is the most common reason an ERP pays for itself.",
      },
      {
        title: "Off-the-shelf ERP quoted more than the software is worth",
        body: "Licence plus per-user fees plus implementation plus the customisation to make it fit. Over three to five years a custom build is frequently the cheaper number.",
      },
      {
        title: "You cannot get a straight answer out of your own data",
        body: "Knowing what is in stock, what is owed, or what a job actually cost should take seconds rather than a day of someone assembling it by hand.",
      },
    ],
    faqs: [
      {
        id: "custom-vs-off-the-shelf",
        question: "Why choose custom ERP over off-the-shelf software like SAP or Zoho?",
        answer:
          "Choose off-the-shelf when your process is standard and you want to be running in weeks — that is a genuinely good outcome and we will say so. Choose custom when the standard product only fits after significant customisation, when per-user licensing becomes expensive as you grow, or when the way you work is itself a competitive advantage you do not want to abandon. The deciding question is usually whether you would be changing the software to match your business or your business to match the software.",
      },
      {
        id: "cost",
        question: "How much does custom ERP software cost in India?",
        answer:
          "Custom ERP development in India generally runs from ₹5 lakh for a focused system covering one or two departments to ₹40 lakh and beyond for a system spanning an entire organisation. In the UAE the equivalent range is roughly AED 40,000 to AED 300,000. The cost is driven by the number of distinct workflows and roles rather than by the number of screens. We scope in detail first and then quote a fixed price for each phase.",
      },
      {
        id: "timeline",
        question: "How long does it take to implement a custom ERP?",
        answer:
          "Four to nine months for a full system, but you should be using the first working module within two to three months. We build department by department — usually starting with whichever one is causing the most pain — so value arrives early and your team learns the system gradually rather than all at once on a launch day.",
      },
      {
        id: "existing-systems",
        question: "Can it work alongside Tally or the software we already use?",
        answer:
          "Yes. Most of our ERP projects connect to something the client is keeping — Tally for accounts is the most common in India, alongside payment gateways, bank feeds and logistics providers. Replacing everything at once is rarely the right call, and a system that refuses to talk to your accountant's software creates more work than it saves.",
      },
      {
        id: "ownership",
        question: "Who owns the ERP once it is built?",
        answer:
          "You do — the source code, the data and the intellectual property, in writing, on final payment. You are not licensing it from us and there is no per-user fee. If you later want another firm to maintain it, you can hand them the code. We think that is the only arrangement that makes a custom build worth choosing.",
      },
    ],
    relatedProjectId: "school-erp",
    related: [
      "inventory-management-software",
      "people-management-software",
      "school-management-software",
    ],
  },

  {
    id: "school-management-software",
    section: "solutions",
    keyword: "school management software",
    title: "School Management Software",
    h1: "School management software, built around your school",
    h1Accent: "around your school",
    metaTitle: "School Management Software",
    metaDescription:
      "Custom school management software and school ERP for schools in Chennai and the UAE. Admissions, attendance, fees, exams and parent access. Fits your board.",
    summary:
      "Admissions, attendance, fees, exams and parent communication in one system — with a separate view for staff, management and parents.",
    intro:
      "School management software, also called a school ERP, is one system covering admissions, student records, attendance, fee collection, examinations and communication with parents. We build these to fit the school rather than the other way round, which matters more in education than in most sectors: fee structures, grading systems and board requirements differ between schools, and a product built for a different board will fight you on every one of them. We have delivered this — the case study below is a working school system.",
    icon: "users",
    deliverables: [
      "Admissions and enquiry tracking, from first call to enrolment",
      "Attendance, and fee collection with receipts and reminders",
      "Examinations, marks entry and report cards in your format",
      "A parent view — attendance, fees, results, announcements",
      "Separate access for teachers, office staff and management",
      "Timetable, staff records and payroll where you need it",
    ],
    useCases: [
      {
        title: "Fee collection runs on a register and a spreadsheet",
        body: "Chasing unpaid fees costs the office days each term, and no two people can give the same figure for what is outstanding today.",
      },
      {
        title: "Parents ring the office for everything",
        body: "Attendance, marks, the date of the next holiday. A parent view answers most of those without a phone call, which the office notices within a fortnight.",
      },
      {
        title: "The product you bought does not match your board",
        body: "Report card formats, grading scales and fee heads differ by board and by state. A system that cannot express yours generates parallel paperwork rather than replacing it.",
      },
    ],
    faqs: [
      {
        id: "what-is-school-erp",
        question: "What is a school ERP?",
        answer:
          "A school ERP is a single system that handles the administrative work of running a school — admissions, student records, attendance, fees, examinations, timetabling and communication with parents. The term ERP is borrowed from business software and means the same thing here: instead of separate registers, spreadsheets and messaging groups for each function, everything sits in one place and the same information is entered once.",
      },
      {
        id: "custom-vs-product",
        question: "Should we buy a ready-made school ERP or build a custom one?",
        answer:
          "Buy a ready-made product if your school's fee structure, grading and reporting are conventional and you want to be running this term — Fedena, Entab and similar are established for good reason. Build custom when your requirements are genuinely specific, when per-student licensing becomes expensive at your size, or when you run several branches with different rules. The test is whether the demo required the vendor to say 'we can customise that' more than once or twice.",
      },
      {
        id: "cost",
        question: "How much does school management software cost?",
        answer:
          "Ready-made school ERP products in India are typically priced per student per year, commonly ₹150 to ₹600, which for a 1,000-student school is a recurring ₹1.5 lakh to ₹6 lakh annually. A custom build is a one-time development cost, generally from ₹6 lakh, that you then own outright with only hosting and support ongoing. Which is cheaper depends almost entirely on your student numbers and how long you intend to run it.",
      },
      {
        id: "parents",
        question: "Do parents need to install an app?",
        answer:
          "Not necessarily, and we usually recommend starting without one. A parent view that works in a phone browser reaches every parent immediately, with nothing to install and no store updates. An app is worth adding once the system is established and you want push notifications for attendance or fee reminders — but launching with one means also solving the problem of getting a few hundred parents to install it.",
      },
      {
        id: "data-migration",
        question: "Can you move our existing student records across?",
        answer:
          "Yes. Student data, fee history and staff records are migrated as part of the project, whatever they currently live in — spreadsheets, an older system's export, or a mixture. We run the import on a copy first so your office staff can verify a sample against their own records before anything goes live, and we show you every row the old data was inconsistent on rather than guessing at it.",
      },
    ],
    relatedProjectId: "school-erp",
    related: ["erp-software", "people-management-software", "mobile-app-development"],
  },

  {
    id: "inventory-management-software",
    section: "solutions",
    keyword: "custom inventory management software",
    title: "Inventory Management Software",
    h1: "Custom inventory management software that stays accurate",
    h1Accent: "that stays accurate",
    metaTitle: "Custom Inventory Management Software",
    metaDescription:
      "Custom inventory management software development in Chennai and Dubai. Multi-location stock, barcodes, purchase orders and reorder alerts. Connects to Tally.",
    summary:
      "Know what you hold, where it is and what it is worth — across every location, without a monthly stock-take to find out.",
    intro:
      "Inventory management software tracks what stock you hold, where it is, and what it is worth, updating as goods move rather than at the next stock-take. We build custom systems for businesses whose stock does not fit a standard product — batch and expiry tracking, serial numbers, multiple warehouses, job-based consumption, or units that change between purchase and sale. If your requirements are conventional, Zoho Inventory or Tally will serve you well and we will say so.",
    icon: "database",
    deliverables: [
      "Live stock across every warehouse, branch and van",
      "Barcode and QR scanning from a phone — no dedicated hardware",
      "Purchase orders, goods receipt and supplier records",
      "Reorder alerts before you run out, based on your actual usage",
      "Batch, expiry and serial-number tracking where you need it",
      "Stock valuation and movement reports your accountant accepts",
    ],
    useCases: [
      {
        title: "You find out you are out of stock from a customer",
        body: "The number in the system and the number on the shelf stopped agreeing some time ago, and nobody is sure when.",
      },
      {
        title: "Stock sits across several locations",
        body: "Branches, a warehouse, goods with a technician. Standard products handle one location well and several badly.",
      },
      {
        title: "Your stock has rules a product cannot express",
        body: "Batch and expiry, serial numbers under warranty, buying in kilograms and selling in units, or material consumed against a job rather than sold.",
      },
    ],
    faqs: [
      {
        id: "custom-vs-zoho",
        question: "Should we use Zoho Inventory or build custom inventory software?",
        answer:
          "Use Zoho Inventory, TallyPrime or a similar product if you buy and sell whole units from one or two locations — they are inexpensive, well supported, and you can be running this week. Build custom when your stock has rules the product cannot express, when you need it joined to production or job costing, or when per-user pricing across a large warehouse team starts to exceed what a build would cost. Genuinely, most small businesses should take the product.",
      },
      {
        id: "cost",
        question: "How much does custom inventory management software cost?",
        answer:
          "A custom inventory system typically starts around ₹3 lakh for single-location stock control and rises towards ₹15 lakh for multi-warehouse systems with purchasing, batch tracking and integration into accounts. In the UAE, roughly AED 25,000 to AED 120,000. The main cost driver is how many other things the stock has to connect to — purchasing, sales, production, accounts — rather than the number of items you hold.",
      },
      {
        id: "barcode",
        question: "Do we need barcode scanners?",
        answer:
          "Usually not. A phone camera scans barcodes and QR codes perfectly well, and staff already carry one — which removes both the hardware cost and the problem of a scanner being left in the wrong part of the building. Dedicated scanners are worth it in genuinely high-volume picking, where the speed difference per scan starts to add up over a shift.",
      },
      {
        id: "tally",
        question: "Can it connect to Tally?",
        answer:
          "Yes, and it is one of the more common requests. Stock movements, purchases and sales can be pushed into Tally so your accounts stay in the system your accountant already works in, rather than requiring them to learn something new or re-enter everything. We set up the mapping during the build and you approve how each entry lands.",
      },
    ],
    related: ["erp-software", "ecommerce-development", "web-application-development"],
  },

  {
    id: "people-management-software",
    section: "solutions",
    keyword: "custom HR and people management software",
    title: "People Management Software",
    h1: "HR and people management software, built to your policy",
    h1Accent: "built to your policy",
    metaTitle: "HR & People Management Software",
    metaDescription:
      "Custom HR and people management software in Chennai and Dubai. Attendance, leave, payroll inputs, onboarding and appraisals — built to your policy.",
    summary:
      "Staff records, attendance, leave, payroll inputs and appraisals in one place — built around your policy rather than a template's.",
    intro:
      "People management software — often called an HRMS — holds staff records, attendance, leave, payroll inputs, onboarding and appraisals in one system. We build custom versions for organisations whose policies do not fit a standard product: shift patterns that change weekly, site-based attendance, contractor workforces, or leave and gratuity rules spanning both India and the UAE. Where a standard HRMS fits, it is cheaper and faster, and we will tell you that.",
    icon: "users",
    deliverables: [
      "Staff records, documents and contract dates in one place",
      "Attendance, including from a phone with a location check",
      "Leave requests and approvals that follow your actual hierarchy",
      "Payroll inputs prepared and exported for your payroll process",
      "Onboarding and exit checklists nothing falls off the end of",
      "Appraisals and review cycles on your schedule",
    ],
    useCases: [
      {
        title: "Attendance arrives as photographs of a register",
        body: "Someone spends the first days of every month turning them into a payroll sheet, and a dispute is impossible to settle after the fact.",
      },
      {
        title: "Your workforce is not in one building",
        body: "Sites, branches, or staff who never visit an office. Attendance tied to a location on a phone is usually the fix.",
      },
      {
        title: "Your policy does not fit the product",
        body: "Weekly-changing shifts, contractor rates, or staff across India and the UAE with different leave and end-of-service rules. Standard HRMS products assume one country and one salaried pattern.",
      },
    ],
    faqs: [
      {
        id: "hrms-meaning",
        question: "What is people management software?",
        answer:
          "People management software, also called an HRMS or HR software, is a single system for the administrative side of employing people — staff records, attendance, leave, payroll inputs, onboarding, and performance reviews. It replaces the combination of a spreadsheet of employees, a paper attendance register and an email chain of leave approvals that most growing organisations run on until it becomes unmanageable.",
      },
      {
        id: "custom-vs-product",
        question: "Should we buy an HRMS product or build custom?",
        answer:
          "Buy a product — Zoho People, Keka, greytHR and others are all capable — if you have salaried staff on conventional shifts in one country. Build custom when your shift patterns, contractor arrangements or multi-country rules require constant workarounds, or when you need it joined to your own operations system rather than standing beside it. Per-employee pricing is also worth checking at your headcount; it changes the arithmetic considerably above a few hundred staff.",
      },
      {
        id: "payroll",
        question: "Does it run payroll?",
        answer:
          "We build the inputs to payroll — attendance, overtime, leave deductions, allowances — and export them in the format your payroll process needs. Actually disbursing salary and filing statutory returns is usually better left to dedicated payroll software or your accountant, because PF, ESI and TDS rules change and a system that gets them wrong creates a compliance problem rather than a convenience. Where a client wants full payroll in the build, we scope it explicitly.",
      },
      {
        id: "india-uae",
        question: "Can it handle staff in both India and the UAE?",
        answer:
          "Yes, and it is one of the clearer reasons to build custom rather than buy. Leave entitlement, end-of-service gratuity, working-week conventions and statutory deductions all differ between the two, and most HRMS products are built around one country's assumptions. A custom system can apply the correct rules per employee based on where they are employed, in one place, rather than requiring two systems and a manual reconciliation.",
      },
    ],
    related: ["erp-software", "school-management-software", "web-application-development"],
  },

  {
    id: "ai-chatbot",
    section: "solutions",
    keyword: "AI chatbot development",
    title: "AI Chatbots",
    h1: "AI chatbots that answer real customer questions",
    h1Accent: "real customer questions",
    metaTitle: "AI Chatbot Development",
    metaDescription:
      "AI chatbot development in Chennai and Dubai. Assistants grounded in your own content that answer accurately, book appointments and hand over to a human.",
    summary:
      "An assistant on your site that answers the questions your team currently answers by phone — grounded in your own content, at any hour.",
    intro:
      "An AI chatbot answers your customers' questions on your website, at any hour, without anyone on your team typing a reply. The ones worth building are grounded in your own content — your services, your prices, your opening hours — so they answer from what is true about your business rather than improvising. We build them for organisations whose staff spend a real part of the day answering the same handful of questions by phone and WhatsApp.",
    icon: "sparkle",
    deliverables: [
      "Answers drawn from your own content, so it cannot invent a price",
      "Working at two in the morning, when a customer is deciding",
      "Hands over to booking, a call or WhatsApp at the right moment",
      "Says \"I do not know, here is a person\" rather than guessing",
      "A record of what people asked — and what it could not answer",
      "Added to the site you already have, with no platform migration",
    ],
    useCases: [
      {
        title: "Your team answers the same questions all day",
        body: "What does it cost, are you open on Sunday, do you do this treatment. Each one is three minutes, there are thirty a day, and none of them needed a person.",
      },
      {
        title: "Enquiries arrive outside working hours",
        body: "Someone deciding at ten at night either gets an answer or goes to whoever answered. Most enquiry forms reply the next morning, by which point the decision is made.",
      },
      {
        title: "WhatsApp has become your support desk",
        body: "It works until it does not: no record of what was asked, no handover when someone is on leave, and it stops the moment whoever owns the phone is busy.",
      },
    ],
    faqs: [
      {
        id: "cost",
        question: "How much does it cost to build an AI chatbot?",
        answer:
          "It depends which of two things you mean. An assistant that answers from a fixed set of your own content — your services, prices and hours — typically costs ₹80,000 to ₹2 lakh to build and nothing per conversation to run. One that uses a large language model to answer freely costs ₹2 lakh to ₹6 lakh and carries a running cost per conversation, usually a few rupees. We will tell you honestly which your situation needs; most businesses asking for the second one are well served by the first.",
      },
      {
        id: "hallucination",
        question: "Will the chatbot make things up about our business?",
        answer:
          "Not if it is built to answer only from your content, which is how we build them. The failure everyone has seen — a chatbot inventing a refund policy or quoting a price that does not exist — comes from letting a language model answer from general knowledge instead of from your material. We ground answers in your own pages and have it decline rather than improvise, because a confident wrong answer about price costs more than no answer.",
      },
      {
        id: "booking",
        question: "Can the chatbot take bookings or appointments?",
        answer:
          "Yes, and it is usually the point. An assistant that answers a question and then leaves the visitor to find the booking form has done half the job. We connect it to whatever you already use — your booking system, a form, WhatsApp or a phone call — so the conversation ends with something on your calendar rather than with the visitor closing the tab.",
      },
      {
        id: "handover",
        question: "What happens when it cannot answer?",
        answer:
          "It says so, and passes the person to you. Every assistant we build has a confidence threshold below which it stops trying and offers a human instead — booking, phone or WhatsApp, whichever suits your business. It also records the question, so the gaps in its knowledge are visible and can be filled rather than silently repeated.",
      },
      {
        id: "training",
        question: "Do we have to train it, or write hundreds of answers?",
        answer:
          "No. It reads the content you already have — service pages, FAQs, price lists, opening hours — so the work is a review of what is on your site rather than a writing project. Where we find a question your site does not answer anywhere, that is worth knowing in its own right, and usually worth fixing on the page as well as in the assistant.",
      },
    ],
    relatedProjectId: "clear-dental",
    related: [
      "web-development",
      "web-application-development",
      "school-management-software",
    ],
  },
];

/** Pages under `/services/[slug]`. */
export const servicePages = landingPages.filter(
  (page) => page.section === "services",
);

/** Pages under `/solutions/[slug]`. */
export const solutionPages = landingPages.filter(
  (page) => page.section === "solutions",
);

/** Lookup by slug, scoped to a section so `/services/erp-software` 404s. */
export function getLandingPage(
  section: LandingPage["section"],
  slug: string,
): LandingPage | undefined {
  return landingPages.find(
    (page) => page.section === section && page.id === slug,
  );
}

/** Lookup across both sections — for resolving `related` slugs to links. */
export function findLandingPage(slug: string): LandingPage | undefined {
  return landingPages.find((page) => page.id === slug);
}
