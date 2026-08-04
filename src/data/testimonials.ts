export interface Testimonial {
  id: string;
  /** The quote itself, without surrounding quotation marks. */
  quote: string;
  /** Person's name, or a role-only attribution if they prefer not to be named. */
  author: string;
  /** Job title. */
  role: string;
  /** Company name, or sector if the client is not publicly referenceable. */
  company: string;
  /** Optional headshot in `public/testimonials/`. Falls back to initials. */
  avatar?: string;
}

/**
 * ⚠️ SAMPLE CONTENT — NOT REAL CLIENT ENDORSEMENTS.
 *
 * No approved client testimonials have been supplied for this site. Rather than
 * attribute invented quotes to the real clients in `projects.ts` — which would
 * be a fabricated endorsement on a live commercial website — these entries use
 * generic, clearly fictional attributions and the section renders a visible
 * "sample content" notice while `TESTIMONIALS_ARE_PLACEHOLDER` is `true`.
 *
 * To go live:
 *   1. Collect written, approved quotes from real clients.
 *   2. Replace the entries below.
 *   3. Set `TESTIMONIALS_ARE_PLACEHOLDER` to `false` — the notice disappears.
 *
 * If launch happens before quotes are collected, set `testimonials` to `[]`;
 * `<TestimonialsSection>` renders nothing when the list is empty, so the page
 * stays valid rather than shipping placeholder praise.
 */
export const TESTIMONIALS_ARE_PLACEHOLDER = true;

export const testimonials: Testimonial[] = [
  {
    id: "sample-1",
    quote:
      "They pushed back on our original spec in the first week and were right to. We shipped a smaller first release than we planned and had paying users two months earlier than the original timeline.",
    author: "Sample Client",
    role: "Head of Product",
    company: "B2B SaaS company",
  },
  {
    id: "sample-2",
    quote:
      "Three school offices were running on spreadsheets that never agreed with each other. Six months on, the administrators trust the numbers and reconciliation is not a weekly meeting any more.",
    author: "Sample Client",
    role: "Operations Director",
    company: "Education group",
  },
  {
    id: "sample-3",
    quote:
      "What stood out was the handover. Our own two engineers picked the codebase up without a single escalation, which is not how any previous vendor engagement ended for us.",
    author: "Sample Client",
    role: "CTO",
    company: "Logistics platform",
  },
];
