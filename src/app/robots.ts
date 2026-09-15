import type { MetadataRoute } from "next";
import { site } from "@/constants/site";

/**
 * robots.txt.
 *
 * The wildcard rule below already allowed every crawler, AI ones included — by
 * silence. Naming them makes the posture deliberate rather than accidental, and
 * it is the right posture for this site: a company that wants to be found and
 * described accurately by answer engines has no reason to lock them out, and a
 * B2B buyer increasingly meets the brand through one of them first.
 *
 * Listing them is not redundant with `User-Agent: *`. Some of these crawlers
 * check for their own name before falling back to the wildcard, and a named
 * `Allow` is the only way to say "yes, deliberately" rather than "nobody
 * thought about it". If that position ever changes, this is the one file to
 * edit — flip a name to `disallow: "/"` and it is out.
 *
 * `Google-Extended` is the odd one: it is not a crawler at all. It is a
 * training/grounding opt-out token that Google reads here, and it does not
 * affect Search indexing either way.
 */

/** Crawlers that read pages to answer questions, rather than to rank them. */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — training
  "OAI-SearchBot", // OpenAI — ChatGPT Search surfacing
  "ChatGPT-User", // OpenAI — a user asking about a specific page
  "ClaudeBot", // Anthropic — training
  "Claude-Web", // Anthropic — user-initiated fetch
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini grounding / training opt-out token
  "Applebot-Extended",
  "CCBot", // Common Crawl, which feeds many downstream models
  "Bytespider",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
