import { faqGroups } from "@/data/faq";
import { landingPages } from "@/data/landingPages";
import { locations } from "@/data/locations";
import { projects } from "@/data/projects";
import { articles } from "@/data/articles";
import { contact } from "@/constants/site";
import {
  caseStudyPath,
  landingPath,
  locationPath,
  articlePath,
  routes,
} from "@/constants/navigation";

/**
 * The assistant's knowledge base.
 *
 * ## Derived, never written
 *
 * Every answer here already exists somewhere on the site — the thirteen FAQs,
 * four or five on each of nine landing pages, the location pages, the case
 * studies and the articles. Roughly seventy passages, each written to be read
 * by a person and quotable on its own.
 *
 * Nothing is restated. Adding a landing page or an FAQ makes the assistant able
 * to answer that question the same day, and editing an answer on the site edits
 * what the assistant says. A hand-written bot script would have started
 * drifting from the pages within a month, and a visitor being told one thing by
 * the chat and another by the page is worse than having no chat.
 *
 * ## Why this file is loaded lazily
 *
 * It pulls in most of the site's content data, which is a meaningful amount of
 * text to ship. `ChatWidget` therefore `import()`s it on first open rather than
 * at module scope, so a visitor who never opens the chat downloads none of it.
 *
 * ## What it deliberately cannot do
 *
 * It matches; it does not generate. Every reply is a passage written by a
 * person, returned verbatim, with a link to where it came from. So it cannot
 * invent a price, agree to a deadline, or describe a capability we do not have
 * — which are the three ways a chatbot on a software company's site does real
 * commercial damage.
 */

export interface ChatAnswer {
  id: string;
  /** What this passage answers, as a person would ask it. */
  question: string;
  /** Returned verbatim. Never summarised, never recombined. */
  answer: string;
  /** Where the full version lives, so a reader can check it. */
  href?: string;
  hrefLabel?: string;
  /**
   * Extra terms that should match this entry but do not appear in the question
   * — mostly the page's target keyword and the vocabulary a buyer would use.
   */
  terms: string[];
}

/**
 * Words carried by almost every question, which therefore distinguish nothing.
 *
 * Short list on purpose. Stripping too much turns "how much does it cost" into
 * "cost" and loses the fact that it was a price question at all.
 */
const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "do", "does", "did", "doing", "have", "has", "had", "i", "we", "you",
  "your", "our", "us", "my", "me", "it", "its", "to", "of", "in", "on",
  "for", "with", "and", "or", "but", "if", "so", "at", "by", "from",
  "can", "could", "would", "should", "will", "shall", "may", "might",
  "what", "which", "who", "whom", "that", "this", "these", "those",
  "there", "here", "about", "into", "than", "then", "also", "any",
]);

export function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9₹$\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

/** Built once, on first import of this module. */
export const chatAnswers: ChatAnswer[] = [
  /* The FAQ page — the broadest coverage of cost, timeline and ownership. */
  ...faqGroups.flatMap((group) =>
    group.items.map((item) => ({
      id: `faq-${item.id}`,
      question: item.question,
      answer: item.answer,
      href: `${routes.faq}#${item.id}`,
      hrefLabel: "Read this on the FAQ page",
      terms: tokenize(group.heading),
    })),
  ),

  /* Each landing page, twice over: what it is, and its own questions. */
  ...landingPages.flatMap((page) => [
    {
      id: `page-${page.id}`,
      question: `What is ${page.title.toLowerCase()}?`,
      answer: page.intro,
      href: landingPath(page.section, page.id),
      hrefLabel: `See ${page.title}`,
      terms: [...tokenize(page.keyword), ...tokenize(page.title), ...tokenize(page.summary)],
    },
    ...page.faqs.map((faq) => ({
      id: `page-${page.id}-${faq.id}`,
      question: faq.question,
      answer: faq.answer,
      href: landingPath(page.section, page.id),
      hrefLabel: `More on ${page.title}`,
      terms: tokenize(page.keyword),
    })),
  ]),

  /* Where we work. */
  ...locations.flatMap((location) => [
    {
      id: `location-${location.id}`,
      question: `Do you work in ${location.city}?`,
      answer: location.intro,
      href: locationPath(location.id),
      hrefLabel: `Software development in ${location.city}`,
      terms: [...tokenize(location.city), ...tokenize(location.country), ...location.areasServed.flatMap(tokenize)],
    },
    ...location.faqs.map((faq) => ({
      id: `location-${location.id}-${faq.id}`,
      question: faq.question,
      answer: faq.answer,
      href: locationPath(location.id),
      hrefLabel: `More about ${location.city}`,
      terms: tokenize(location.city),
    })),
  ]),

  /* Work that shipped — the answer to "have you done this before". */
  ...projects.map((project) => ({
    id: `project-${project.id}`,
    question: `Have you built ${project.category.toLowerCase()} before?`,
    answer: `${project.summary} ${project.description}`,
    href: caseStudyPath(project.id),
    hrefLabel: `Read the ${project.title} case study`,
    terms: [
      ...tokenize(project.title),
      ...tokenize(project.category),
      ...project.tags.flatMap(tokenize),
    ],
  })),

  /* Articles, answering the questions people ask before they are ready to talk. */
  ...articles.map((article) => ({
    id: `article-${article.id}`,
    question: article.h1,
    answer: article.standfirst,
    href: articlePath(article.id),
    hrefLabel: "Read the full article",
    terms: tokenize(article.keyword),
  })),

  /* Two facts that live in `constants/site.ts` rather than in any page's prose,
     and which people ask the chat directly. */
  {
    id: "contact-details",
    question: "How do I contact you?",
    answer: `Email ${contact.email}, or call ${contact.phones
      .map((phone) => `${phone.display} (${phone.label})`)
      .join(" or ")}. Both numbers are on WhatsApp. We reply ${contact.responseTime}.`,
    href: routes.contact,
    hrefLabel: "Open the contact page",
    terms: ["contact", "email", "phone", "call", "number", "whatsapp", "reach", "talk"],
  },
  {
    id: "response-time",
    question: "How quickly will you reply?",
    answer: `We reply ${contact.responseTime}. If it is urgent, calling is faster than the form — both numbers are answered during working hours in their own region.`,
    href: routes.contact,
    hrefLabel: "Send an enquiry",
    terms: ["reply", "respond", "response", "quickly", "soon", "fast", "wait", "hear"],
  },
];

export interface ChatMatch {
  answer: ChatAnswer;
  score: number;
}

/**
 * Scores every entry against a query and returns the best, or `null`.
 *
 * Weighting: a hit in the question text counts most, because that is what the
 * passage is *about*; a hit in the curated terms counts nearly as much, since
 * those are the words a buyer uses for the same thing; a hit in the body counts
 * least, because a long answer mentions many words incidentally.
 *
 * The score is normalised by how many tokens the query had, so a one-word query
 * is not automatically outscored by a long one.
 */
export function findAnswer(query: string): ChatMatch | null {
  const tokens = tokenize(query);
  if (tokens.length === 0) return null;

  let best: ChatMatch | null = null;

  for (const answer of chatAnswers) {
    const question = answer.question.toLowerCase();
    const body = answer.answer.toLowerCase();
    const terms = new Set(answer.terms);

    let score = 0;
    for (const token of tokens) {
      if (question.includes(token)) score += 1;
      else if (terms.has(token)) score += 0.8;
      else if (body.includes(token)) score += 0.25;
    }

    score /= tokens.length;

    if (!best || score > best.score) best = { answer, score };
  }

  /* Below this the match is coincidental — usually one common word landing in a
     long body. Returning nothing is the right answer: the widget then says it
     does not know and offers a person, which is far better than confidently
     handing back a passage about something else. */
  return best && best.score >= 0.5 ? best : null;
}
