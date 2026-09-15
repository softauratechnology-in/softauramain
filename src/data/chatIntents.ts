import { contact } from "@/constants/site";

/**
 * The assistant's own voice — everything it says that is not a quoted passage.
 *
 * Kept small on purpose. The answers come from `lib/chatIndex.ts`, which is
 * derived from the site's real content; this file holds only the connective
 * tissue, and every line of it is written to be honest about what the thing is.
 * It does not claim to be a person, it does not open with "How can I help you
 * today?", and when it does not know something it says so in one sentence
 * rather than three apologetic ones.
 */

export const chatGreeting =
  "Hello. I can answer questions about what we build, what it costs and how long it takes — using the same answers that are on this site.";

/**
 * Shown under the greeting, and again after an answer.
 *
 * These are the five things people actually open a chat to ask. Offering them
 * as buttons means most conversations need no typing at all, which matters more
 * on a phone than anything else in this component.
 */
export const chatQuickReplies = [
  "What does custom software cost?",
  "How long does it take to build?",
  "Do you build ERP software?",
  "Can you build an AI chatbot?",
  "Where are you based?",
];

/**
 * When nothing matches above the confidence threshold.
 *
 * Says it does not know and routes to a person. The alternative — returning the
 * closest passage anyway — is how a chatbot ends up confidently answering a
 * question about price with a paragraph about hosting.
 */
export const chatFallback =
  "I do not have an answer to that one. Rather than guess, let me put you in front of someone who does — a reply usually comes back " +
  contact.responseTime +
  ".";

/** Appended to the fallback and offered after any answer. */
export const chatHandoffPrompt = "Ask us directly";
