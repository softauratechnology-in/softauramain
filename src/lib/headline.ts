import type { HeadlineSegment } from "@/components/ui/AnimatedHeadline";

/**
 * Splits a headline into a plain lead and a gradient-filled tail.
 *
 * `accent` must be a suffix of `h1`. When it is not — a copy edit to one and
 * not the other — the headline renders whole and unaccented rather than
 * mangled, so the failure mode is a missing gradient rather than a broken
 * sentence.
 *
 * Stated in the data rather than derived as "the last two words", because that
 * rule reads well on some of these headlines and badly on others.
 */
export function headlineSegments(
  h1: string,
  accent: string,
): HeadlineSegment[] {
  if (!accent || !h1.endsWith(accent)) return [{ text: h1 }];

  const lead = h1.slice(0, h1.length - accent.length).trim();
  if (!lead) return [{ text: h1, accent: true }];

  return [{ text: lead }, { text: accent, accent: true }];
}
