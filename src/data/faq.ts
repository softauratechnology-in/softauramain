/**
 * Frequently asked questions.
 *
 * These serve two readers at once, which shapes how they are written:
 *
 *  1. **A person deciding whether to call us.** Plain language, no stack names,
 *     and an honest answer even where the honest answer is "it depends".
 *  2. **A search engine or AI assistant answering on our behalf.** Both Google's
 *     rich results and LLM-generated answers quote a *single* self-contained
 *     passage. So every answer opens with a direct sentence that resolves the
 *     question on its own, before any elaboration — an answer that begins "It
 *     depends on several factors" gets quoted saying nothing.
 *
 * Kept to roughly 40–90 words each: long enough to be useful, short enough to
 * be lifted whole. The page emits these as `FAQPage` structured data, so the
 * text here is what gets published — write it as the public answer, not as
 * internal notes.
 */

import type { IconName } from "@/components/ui/Icon";

export interface FaqItem {
  /** Stable key, also the anchor fragment so a single answer can be linked. */
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  heading: string;
  /** Glyph for the category tiles above the accordion. */
  icon: IconName;
  /** One line describing what this group covers, shown on the tile. */
  blurb: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: "getting-started",
    heading: "Getting started",
    icon: "rocket",
    blurb: "What the first conversation looks like, and what we need from you.",
    items: [
      {
        id: "how-to-start",
        question: "How do we start working with you?",
        answer:
          "It starts with a 30-minute call, and you do not need anything prepared for it. Describe the problem in your own words — you do not need a specification, a budget or a solution in mind. We come back within one business day with an honest view on scope, timeline and cost, including whether it is something we should be building at all. Nothing is chargeable until there is a scope and a price you have agreed in writing.",
      },
      {
        id: "nda",
        question: "Do you sign an NDA?",
        answer:
          "Yes, and we will sign yours rather than insisting on ours. Send it across before the first call if you would rather not describe the idea without one. If you do not have one, we can provide a standard mutual NDA. In practice most of what makes a software business defensible is the execution rather than the concept, but that is your call to make and not ours.",
      },
      {
        id: "take-over-project",
        question: "Can you take over a project another developer started?",
        answer:
          "Often, yes — but we will look at the code before agreeing, not after. A half-finished system can be a good foundation or an expensive thing to unpick, and the difference is not visible from the outside. We do a paid technical review of a few days, then tell you plainly whether to continue it, rebuild the weak parts, or start again. We would rather lose that work than inherit something we cannot stand behind.",
      },
      {
        id: "startups",
        question: "Do you work with startups, or only established businesses?",
        answer:
          "Both, and the work is genuinely different. An established business usually has a process that works and needs software shaped around it. A startup is often still finding out what it is building, so we scope smaller, ship sooner and expect to change direction — a six-month specification written before the first customer is mostly fiction. What we will not do is take a fixed-price, fixed-scope brief from a founder who has not yet spoken to the people who would use it.",
      },
    ],
  },
  {
    id: "choosing",
    heading: "Choosing what to build",
    icon: "search",
    blurb:
      "Custom versus off-the-shelf, and what to do with what you already run.",
    items: [
      {
        id: "custom-erp-vs-off-the-shelf",
        question: "Why choose a custom ERP over off-the-shelf software?",
        answer:
          "Choose custom when your organisation's way of working is the thing that makes it good, and off-the-shelf when it is not. Ready-made systems are cheaper to start and are the right answer for common problems like accounting. But they assume a standard process, so you end up changing how you work to suit the software, or paying for workarounds every year. A custom system fits what you already do — and it is worth it when that process is genuinely yours, when you are stitching several tools together by hand, or when the licence cost per user has started to grow faster than you have.",
      },
      {
        id: "school-erp",
        question: "Do you build software for schools?",
        answer:
          "Yes. We have built a school management system covering admissions, student records, attendance, marks and fee collection, with separate views for office staff, teachers, parents and school owners. It is one of the things we are most often asked for. If you are running several offices on spreadsheets that do not agree with each other, that is the specific problem this kind of system solves.",
      },
      {
        id: "existing-system",
        question: "Can you work with software we already have?",
        answer:
          "Usually, yes. Most of our work connects to something already in place rather than replacing everything at once. We can build alongside an existing system, take over one that another team started, or replace a system in stages so your organisation is never left without something that works. We will tell you honestly if we think a rebuild is cheaper than a rescue.",
      },
      {
        id: "website-or-application",
        question: "Do we need a website or a web application?",
        answer:
          "A website presents information; a web application does work. You read a website — pages, images, a contact form. You log into a web application and it stores your records, applies rules about who can see what, and produces reports. The test is whether anyone needs to log in and whether it has to remember what happened last time. If yes, it is an application, whatever it has been called so far — and the two differ by roughly a factor of ten in cost, so it is worth settling before anyone quotes.",
      },
    ],
  },
  {
    id: "time-and-cost",
    heading: "Time and cost",
    icon: "calendar",
    blurb:
      "How long a build takes, what it costs, and how we price it.",
    items: [
      {
        id: "how-long",
        question: "How long does enterprise software take to build?",
        answer:
          "Most business systems take three to six months to reach a first working version people can use every day, and larger platforms take longer. The first two to three weeks go on understanding your process and designing the screens; after that you see a working, usable version every two weeks rather than waiting until the end. We would rather give you a range we can defend at the start than a single date we quietly move later.",
      },
      {
        id: "cost",
        question: "How much does custom software cost?",
        answer:
          "Cost follows scope, so the honest answer is that it depends on what the system has to do — but you should not have to guess. We scope the work before quoting, and give you a written breakdown of what is included, what is not, and what would change the number. Smaller projects such as a website or a focused internal tool sit well below a full multi-user platform. If your budget will not cover what you have described, we will say so early rather than after you have committed.",
      },
      {
        id: "fixed-price",
        question: "Do you work fixed-price or hourly?",
        answer:
          "Both, depending on how well-defined the work is. Where scope is clear — a website, a defined module — a fixed price is fair to everyone. For larger systems that will genuinely change as you see them working, we work in two-week cycles with an agreed rate, so you can change direction without renegotiating a contract. In either case you know the cost before work starts.",
      },
      {
        id: "payment-milestones",
        question: "How do payments and milestones work?",
        answer:
          "We bill against delivered milestones, never against time spent. A project is split into phases with a fixed price each, and each phase ends in something you can open and use rather than a progress report. Typically that is a deposit to start a phase and the balance when you accept it. You are never asked to pay for work you have not seen, and you can stop between phases without penalty.",
      },
    ],
  },
  {
    id: "working-with-us",
    heading: "Working with us",
    icon: "users",
    blurb:
      "Who writes the code, how involved you are, and what happens after launch.",
    items: [
      {
        id: "who-builds-it",
        question: "Who actually writes the code?",
        answer:
          "The senior engineers who scoped your project are the ones who build it. No junior bait-and-switch after the contract is signed, and no handover from a sales team to a delivery team that has never spoken to you. You will know who is working on your system and be able to speak to them directly.",
      },
      {
        id: "involvement",
        question: "How much of our time will this take?",
        answer:
          "Expect a few hours a week from someone who knows how the work actually gets done. The heaviest period is the first two to three weeks, when we are learning your process and agreeing the design — that is where your input changes the outcome most. After that, it is a short review every two weeks to look at working software and confirm the next step. We do not need a full-time project manager from your side.",
      },
      {
        id: "after-launch",
        question: "What happens after the software launches?",
        answer:
          "Launch is not the end of the engagement. Every project can move onto a support arrangement with agreed response times, covering security updates, fixes and improvements as your needs change. We also write the documentation and hand over in a way that lets another team — including your own — take over if you ever want to. You are not locked in by ignorance of your own system.",
      },
      {
        id: "where",
        question: "Where are you based, and do you work remotely?",
        answer:
          "We work with clients across India and the United Arab Emirates, and we work remotely as standard. Meetings happen by video call at a time that suits your working day, and we adjust to your timezone rather than the other way around. Being remote is how we keep senior engineers on your project rather than whoever happens to be local.",
      },
      {
        id: "alongside-our-team",
        question: "Can you work alongside our own developers?",
        answer:
          "Yes, and it is common on larger systems. We agree who owns which part of the codebase before anyone writes anything, share the same repository and review each other's work. Where your team is smaller or newer, we can lead and have them work with us so the knowledge stays in-house after we leave. The arrangement that does not work is two teams building adjacent things without a shared plan, so we will push for one.",
      },
      {
        id: "training",
        question: "Will you train our staff to use it?",
        answer:
          "Yes, and it is part of the project rather than an extra. We run sessions with the people who will actually use the system, recorded so new joiners can watch them later, and we write documentation in plain language rather than technical notes. Systems fail after launch far more often from nobody knowing how to use them than from anything technical.",
      },
      {
        id: "not-happy",
        question: "What if we are not happy with the work?",
        answer:
          "Tell us during the phase rather than at the end of it, and we fix it at no cost. That is why the work is split into short milestones you see and accept one at a time — it keeps the distance between what you expected and what we built to a couple of weeks at most. If a phase is genuinely not what was agreed, we redo it. If we disagree about what was agreed, the written scope settles it, which is why there is always one.",
      },
      {
        id: "changes-after-launch",
        question: "What happens when we need changes after launch?",
        answer:
          "Small changes are covered by a support agreement; anything larger is scoped and quoted like any other work. Most clients keep a monthly retainer that covers security updates, minor changes and an agreed response time, and commission larger pieces as they need them. You are never obliged to come back to us — you own the code, and another team can pick it up.",
      },
      {
        id: "hosting-domains",
        question: "Do you handle hosting, domains and email?",
        answer:
          "Yes, and we set them up in your name rather than ours. The accounts, the domain and the billing are yours from day one, and we are added as a collaborator — so if you ever stop working with us there is nothing to hand back and nothing you can be locked out of. We will tell you what the running costs actually are before committing to anything.",
      },
    ],
  },
  {
    id: "security-and-ownership",
    heading: "Security and ownership",
    icon: "shield",
    blurb:
      "Where your data lives and who owns what we build.",
    items: [
      {
        id: "data-security",
        question: "How do you handle data security?",
        answer:
          "Security is built in as we go, not added before launch. In practice that means: your data is encrypted both while stored and while moving over the internet; each person can only reach the records their role requires; access is logged so you can see who did what; and we check our own components for known vulnerabilities as part of every release. For schools and businesses handling personal records, we will walk through exactly where your data lives and who can reach it before you commit.",
      },
      {
        id: "who-owns-it",
        question: "Who owns the software you build?",
        answer:
          "You do. You own the code, the design and the data, and you get the source code and documentation. We do not hold your system hostage through an account only we can access, and we do not charge a licence fee to keep using something you have already paid us to build. If you decide to move to another team, everything needed to do that is yours.",
      },
      {
        id: "data-location",
        question: "Where is our data stored?",
        answer:
          "Wherever your obligations require it to be. We can host in a specific country or region where your regulations, your clients or your own policy demand it, and we agree this before anything is built rather than discovering a problem at launch. You will know which provider holds your data, in which region, and who has access to it.",
      },
      {
        id: "data-if-we-leave",
        question: "What happens to our data if we stop working with you?",
        answer:
          "You take it with you, in a format another team can use. On request we provide a full database export, the source code, and the credentials to every service the system depends on — and because hosting and domains are registered in your name from the start, there is very little for us to hand over in the first place. We do not hold data hostage and there is no exit fee. It is your system.",
      },
    ],
  },
];

/** Flattened, in page order — for structured data and for counting. */
export const faqItems: FaqItem[] = faqGroups.flatMap((group) => group.items);
