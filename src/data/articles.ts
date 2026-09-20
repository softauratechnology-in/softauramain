/**
 * Long-form articles — `/insights/[slug]`.
 *
 * ## Why four, and not twenty
 *
 * Topical authority is what actually moves a small site on competitive terms,
 * and the figure usually quoted for it is twenty-five to thirty interlinked
 * pages per cluster. The temptation is therefore to generate twenty articles at
 * once.
 *
 * That is scaled content abuse under Google's spam policy — "generating many
 * pages primarily for ranking, with little value to users" — and the penalty
 * lands on the whole domain rather than the offending pages. Four articles
 * written properly, then a cadence of roughly one a fortnight, reaches the same
 * place without betting the site on it.
 *
 * ## What makes one of these worth publishing
 *
 * Each has to answer a question a buyer genuinely asks *before* they are ready
 * to talk to anyone, and answer it well enough to be useful to someone who
 * never contacts us. Three of the four below will happily tell a reader not to
 * hire us — buy the off-the-shelf product, stay on Tally, build a website
 * rather than an application. That is not modesty; a page that only ever
 * concludes "hire us" answers nothing, gets no links, and is transparently an
 * advertisement to the reader and to the engine ranking it.
 *
 * `standfirst` is the passage most likely to be quoted whole by a featured
 * snippet or an AI answer, so it must resolve the headline on its own.
 */

export interface ArticleSection {
  /** Rendered as an `<h2>`. Question-shaped where the content allows. */
  heading: string;
  /** Paragraphs. */
  body: string[];
  /** Optional bulleted points, rendered after the paragraphs. */
  list?: string[];
}

export interface Article {
  /** URL slug. Permanent once shipped. */
  id: string;
  title: string;
  h1: string;
  /** Trailing phrase of `h1` for the gradient. Must be a suffix of it. */
  h1Accent: string;
  metaTitle: string;
  metaDescription: string;
  /** The direct answer, in one or two sentences. */
  standfirst: string;
  /** ISO 8601. Published as `datePublished`. */
  published: string;
  /** ISO 8601, when the piece has been revised since. */
  updated?: string;
  /** The search this is written to answer. */
  keyword: string;
  sections: ArticleSection[];
  /** Landing page slugs this article should link to. */
  related: string[];
}

export const articles: Article[] = [
  {
    id: "custom-erp-software-cost-india",
    title: "What custom ERP software costs in India",
    h1: "What custom ERP software actually costs in India",
    h1Accent: "costs in India",
    metaTitle: "ERP Software Cost in India (2026)",
    metaDescription:
      "What custom ERP development actually costs in India in 2026, what drives the number, and how it compares with licensing SAP, Oracle or Zoho.",
    standfirst:
      "Custom ERP development in India generally costs between ₹5 lakh and ₹40 lakh, depending on how many departments it covers and how many rules it has to enforce. A single-department system — stock control, or order management on its own — typically lands between ₹5 lakh and ₹12 lakh; a system spanning an entire mid-sized company usually runs from ₹20 lakh upwards.",
    published: "2026-09-15",
    keyword: "custom ERP software cost India",
    sections: [
      {
        heading: "Why the range is so wide",
        body: [
          "Because two projects described with the same three letters can differ by a factor of eight. ERP is not a product with a specification; it is a category that covers everything from a stock ledger with a login to a system running purchasing, production, sales, finance and payroll for four hundred people across three sites.",
          "The number is driven almost entirely by one thing, and it is not the one people expect. It is not the number of screens. It is the number of rules the system has to enforce — who can approve what, at what value, in what sequence, with which exceptions. A screen is a day's work. A rule that has four exceptions, two of which nobody mentioned until testing, is a fortnight.",
        ],
      },
      {
        heading: "What each band typically buys",
        body: [
          "These are the bands we see most often for Indian mid-market projects. They assume a competent senior team, fixed-price phases, and that you own the code at the end.",
        ],
        list: [
          "₹5–12 lakh — one department done properly. Inventory, or order-to-invoice, or admissions and fees. Two or three user roles. Three to four months.",
          "₹12–25 lakh — two or three connected departments, with reporting across them. Five or six roles, approval chains, integration into Tally or a payment gateway. Five to seven months.",
          "₹25–40 lakh+ — an organisation-wide system. Most departments, multi-location stock, production or project costing, role-based reporting for management. Seven to twelve months, delivered in phases.",
        ],
      },
      {
        heading: "How it compares with licensing an off-the-shelf ERP",
        body: [
          "The honest comparison is over five years, not at purchase, and it has to include the parts that do not appear on the quotation.",
          "A licensed ERP looks cheaper on day one and is billed per user per year forever. At fifty users on a mid-tier plan you are typically somewhere between ₹6 lakh and ₹15 lakh annually before implementation, and implementation for a serious deployment is rarely less than the first year's licence. Add the customisation needed to make it fit, which is usually billed by a partner at their day rate, and the recustomisation each time the vendor upgrades the platform.",
          "A custom build is a larger one-time cost and then hosting and support — commonly ₹8,000 to ₹40,000 a month depending on scale — with no per-user component at all. The crossover point in most of the projects we have scoped sits somewhere between year two and year four. Below about twenty users, off-the-shelf almost always wins. Above about a hundred, custom almost always does. In between it depends on how badly the standard product fits.",
        ],
      },
      {
        heading: "What makes a quote go up",
        body: [
          "If you want to keep a project at the lower end of its band, these are the things that move it, roughly in order of impact.",
        ],
        list: [
          "Integrations. Each external system — Tally, a bank, a payment gateway, a logistics provider, an existing HR system — is its own small project with its own failure modes.",
          "Data migration from something messy. Clean data moves cheaply. Fifteen years of a spreadsheet where the same supplier appears under six spellings does not.",
          "Approval hierarchies with exceptions. \"The branch manager approves up to ₹50,000, except for these three categories, except at month-end\" is three rules, not one.",
          "Offline working. A system that has to keep functioning without a connection and reconcile afterwards is meaningfully harder than one that does not.",
          "Anything involving statutory calculation. GST is routine; payroll statutory deductions are not, because they change and being wrong creates a compliance problem rather than a bug.",
        ],
      },
      {
        heading: "What we would ask before quoting",
        body: [
          "A number given without these answers is a guess dressed up as a quotation, and the gap gets recovered later as change requests. We would want to know: how many people will use it and in how many distinct roles; which departments are in scope for phase one; what it has to connect to; where your current data lives and what state it is in; and what specifically is going wrong today that made you start looking.",
          "That last question matters more than the rest combined. The most expensive ERP projects are the ones commissioned because it felt like time, rather than to fix something identifiable.",
        ],
      },
    ],
    related: ["erp-software", "inventory-management-software", "web-application-development"],
  },

  {
    id: "school-management-software-buy-or-build",
    title: "School management software: buy or build?",
    h1: "School management software: should you buy or build?",
    h1Accent: "buy or build?",
    metaTitle: "School Software: Buy or Build?",
    metaDescription:
      "Buying a ready-made school ERP against building a custom one — the arithmetic, the failure modes of each, and which schools suit which. Plus a middle path.",
    standfirst:
      "Most schools should buy a ready-made school ERP. Building custom is the right decision in three specific situations: when your fee structure or reporting genuinely cannot be expressed in a standard product, when per-student licensing across a large or growing roll exceeds what a build would cost, and when you run several branches under different rules.",
    published: "2026-09-15",
    keyword: "school management software buy or build",
    sections: [
      {
        heading: "The arithmetic, first",
        body: [
          "Ready-made school ERP products in India are typically priced per student per year, commonly between ₹150 and ₹600 depending on the modules you take. For a school of 1,000 students that is a recurring ₹1.5 lakh to ₹6 lakh a year, and it does not stop.",
          "A custom build is a one-time development cost, generally from around ₹6 lakh for a system covering admissions, attendance, fees and examinations, after which you pay hosting and support — realistically ₹10,000 to ₹25,000 a month for a school of that size.",
          "Run those out over five years. At 500 students on a mid-priced plan the product is clearly cheaper. At 2,000 students the custom build usually costs less in total by year three. Between those, it turns on how much the standard product has to be worked around, and that is not a number you can look up.",
        ],
      },
      {
        heading: "When buying is the right answer",
        body: [
          "Buy if your school is conventional in the ways that matter to software: a single board, a fee structure that fits into heads and instalments, a grading scale the product already supports, and one campus.",
          "Buy if you need it working this term. A product can be running in weeks. A custom build cannot, and a school that commits to one in June for a July start will be disappointed.",
          "Buy if nobody at the school will own the project. A custom build needs someone from the school — usually the head of administration — available to answer questions for several months. Where that person does not exist, the build drifts, and the result fits nobody's process because nobody described one.",
        ],
      },
      {
        heading: "When building is the right answer",
        body: [
          "Build when the demo required the vendor to say \"we can customise that\" more than twice. Each of those is a change you will be quoted for, that will need redoing at the next platform upgrade, and that you will not control.",
          "Build when you run multiple branches with genuinely different rules — different fee structures, different boards, different academic calendars — and the product wants them to be separate accounts that cannot report together.",
          "Build when the data matters to you strategically. A custom system's data is yours, in a database you can query, and you can add anything you want to it. A product's data is yours in principle and behind an export button in practice.",
        ],
      },
      {
        heading: "The failure modes of each",
        body: [
          "Both routes fail, in predictable and different ways, and knowing which failure you are more able to absorb is a better basis for deciding than a feature comparison.",
        ],
        list: [
          "Bought products fail by almost fitting. The system is in place, most of it works, and the office maintains a parallel spreadsheet for the two things it cannot express. That spreadsheet is permanent.",
          "Bought products fail by pricing changes. Per-student pricing at a growing school compounds, and the switching cost rises every year you stay.",
          "Custom builds fail by under-specification. Nobody described how fee concessions actually work, so the system handles the standard case and the office handles the rest by hand.",
          "Custom builds fail by abandonment. The developer stops responding, and nobody else has seen the code. This is why owning the source outright, in writing, is not a formality.",
        ],
      },
      {
        heading: "A middle path worth considering",
        body: [
          "You do not have to decide for the whole school at once. The part of a school ERP that most often does not fit a standard product is fees — concessions, instalments, transport and hostel heads, board-specific requirements. The parts that almost always do fit are attendance and examination records.",
          "Several of the schools we have worked with are best served by keeping a product for the conventional parts and building only the piece that does not fit, with the two connected. It is less elegant than one system and it is frequently the cheapest honest answer.",
        ],
      },
    ],
    related: ["school-management-software", "erp-software", "mobile-app-development"],
  },

  {
    id: "custom-inventory-software-vs-tally-zoho",
    title: "Custom inventory software vs Tally and Zoho",
    h1: "Custom inventory software, Tally or Zoho: which fits?",
    h1Accent: "which fits?",
    metaTitle: "Inventory Software vs Tally & Zoho",
    metaDescription:
      "When Tally or Zoho Inventory is the right choice, when custom inventory software pays for itself, and the stock rules products cannot express.",
    standfirst:
      "If you buy and sell whole units from one or two locations, use Zoho Inventory or TallyPrime — they are inexpensive, well supported, and you can be running this week. Custom inventory software earns its cost when your stock has rules a standard product cannot express: batch and expiry, serial numbers, unit conversion between purchase and sale, or material consumed against a job rather than sold.",
    published: "2026-09-15",
    keyword: "custom inventory management software vs Tally Zoho",
    sections: [
      {
        heading: "What the standard products do well",
        body: [
          "It is worth being specific about this, because the honest answer for most small businesses is that they should not be commissioning software at all.",
          "TallyPrime handles stock as an extension of accounting, which is exactly right if your main question is what the stock is worth and your accountant already lives in Tally. Zoho Inventory handles stock as an extension of order management, which is right if your main question is what you can promise a customer. Both handle multiple warehouses, both do purchase orders and reorder levels, and both cost a small fraction of any custom build.",
          "If that describes your situation, the rest of this article is not for you, and a developer who tells you otherwise is selling.",
        ],
      },
      {
        heading: "The specific rules that break standard products",
        body: [
          "Standard inventory products model stock as countable interchangeable units in a place. Every one of the situations below breaks one of those assumptions, and each is a common reason businesses end up running a parallel spreadsheet alongside software they are paying for.",
        ],
        list: [
          "Batch and expiry. Pharmaceuticals, food, chemicals and cosmetics need stock picked by expiry order and traced by batch when something goes wrong. Partial support for this is worse than none, because it looks like it works.",
          "Serial numbers under warranty. Electronics and equipment where you must know which specific unit went to which customer, and when its warranty ends.",
          "Unit conversion. Buying in kilograms and selling in pieces, or buying in bales and issuing in metres. Products that support a single unit per item force a manual reconciliation somewhere.",
          "Job consumption. Material issued against a work order rather than sold — construction, fabrication, workshops. The stock leaves without a sale, and the cost has to land on the job.",
          "Assembly and kitting. Components consumed to produce a finished item, where both the components and the output are stock you track.",
          "Stock with a third party. Goods with a technician, on approval with a customer, or at a job site — yours, not sold, and not in your warehouse.",
        ],
      },
      {
        heading: "The cost comparison",
        body: [
          "Zoho Inventory's paid tiers run from a few thousand rupees a month depending on order volume and users. Tally is a perpetual licence in the tens of thousands with an annual maintenance component. Either is comfortably under ₹1 lakh a year for most small businesses.",
          "A custom inventory system typically starts around ₹3 lakh for single-location stock control and runs towards ₹15 lakh for multi-warehouse systems with purchasing, batch tracking and integration into accounts.",
          "So the build has to save several years of licence fees or solve a problem the product cannot. In practice it is almost always the second — the businesses for whom this works are not saving on software, they are eliminating the manual process that sits beside the software.",
        ],
      },
      {
        heading: "You can usually keep Tally",
        body: [
          "This is the part most often missed. Choosing custom inventory software does not mean replacing your accounting, and it usually should not.",
          "The common arrangement is a custom system handling stock movements, purchasing and job consumption — the parts that are specific to your operation — pushing the resulting entries into Tally so your accountant keeps working in the software they know. You get a system that matches how you actually hold stock, and nobody in finance has to learn anything.",
          "If a developer proposes replacing your accounting as part of an inventory project, ask why. Occasionally there is a good reason. More often it is scope that benefits the quote.",
        ],
      },
      {
        heading: "How to tell which you are",
        body: [
          "One question settles it in most cases: is there currently a spreadsheet beside your stock system, and what is in it?",
          "If there is no spreadsheet, your product fits and you should leave it alone. If the spreadsheet exists but only holds things that are genuinely one-off, it is not worth ₹5 lakh to eliminate. If the spreadsheet is where the real stock position lives, and the software holds an approximation of it, you have already outgrown the product and are paying for both.",
        ],
      },
    ],
    related: ["inventory-management-software", "erp-software", "ecommerce-development"],
  },

  {
    id: "website-vs-web-application",
    title: "Website or web application: which do you need?",
    h1: "Website or web application: which do you actually need?",
    h1Accent: "which do you actually need?",
    metaTitle: "Website vs Web Application",
    metaDescription:
      "The difference between a website and a web application, what each costs, and how to tell which one you are actually describing. For non-technical buyers.",
    standfirst:
      "A website presents information; a web application does work. You read a website — pages, images, a contact form. You log into a web application and it stores records, applies rules about who can see what, calculates things and produces reports. Most businesses that ask for one eventually need both, and they are separate builds with different costs.",
    published: "2026-09-15",
    keyword: "website vs web application difference",
    sections: [
      {
        heading: "The distinction that actually matters",
        body: [
          "The dividing line is not how it looks, how modern it is, or whether it works on a phone. It is whether the thing stores state that belongs to a particular person.",
          "A restaurant's menu page is a website. Everyone sees the same thing, it changes when the restaurant changes it, and nobody logs in. The system the kitchen uses to track orders is a web application: it has users, each user sees something different, and what it shows depends on what has happened.",
          "That difference drives everything downstream — cost, timeline, hosting, security obligations and what happens when it breaks. A website that is down is embarrassing. An application that is down stops work.",
        ],
      },
      {
        heading: "What each costs, roughly",
        body: [
          "For Indian projects, a business website from a custom team generally runs from around ₹60,000 for a small brochure site to a few lakh for a larger site with custom functionality. Four to eight weeks.",
          "A web application generally starts around ₹3 lakh and runs to ₹25 lakh depending on the number of distinct roles and workflows. Three to six months for a first version people can genuinely use.",
          "The order-of-magnitude gap is not padding. An application has to handle two people editing the same record, a user who should not see another user's data, a report that has to still be correct in three years, and a failure that must not lose anything. None of that exists on a brochure site.",
        ],
      },
      {
        heading: "How to tell which you are describing",
        body: [
          "Ask these of whatever you are planning. Any yes means you are describing an application, whatever you have been calling it.",
        ],
        list: [
          "Does anyone log in?",
          "Do two different people need to see different things?",
          "Does it need to remember what happened last time?",
          "Would you be in trouble if the data in it were lost?",
          "Does someone need a report out of it?",
          "Are there rules about who may approve or change something?",
        ],
      },
      {
        heading: "The expensive mistake in each direction",
        body: [
          "Commissioning an application when you needed a website means spending several lakh and several months on something that a ₹60,000 site would have done. It happens when a business describes its ambitions rather than its immediate need, and the developer prices the ambitions.",
          "Commissioning a website when you needed an application is the more common and more damaging error. It shows up six months later: the site is live, and the actual work is still being done in spreadsheets, because the site was never capable of it. You then pay for the application anyway, and the website was not the foundation of it.",
          "The way to avoid both is unglamorous. Write down what happens today, step by step, including the steps done by hand. The answer is usually obvious from that document and almost never obvious from a conversation about the website.",
        ],
      },
      {
        heading: "You often need both, in order",
        body: [
          "The common path for a growing business is a website first — because that is what brings in enquiries — and an application second, once the volume of work behind those enquiries stops fitting in a spreadsheet.",
          "Built in that order they are two clean projects. Built the other way round, or bundled into one, you tend to get a site that is slower than it should be and an application that was designed around a marketing brief.",
        ],
      },
    ],
    related: ["web-development", "web-application-development", "erp-software"],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.id === slug);
}

/** Newest first, for the index. */
export const articlesByDate = [...articles].sort((a, b) =>
  b.published.localeCompare(a.published),
);
