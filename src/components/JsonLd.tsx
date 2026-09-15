import { jsonLd } from "@/lib/schema";

/**
 * One JSON-LD block.
 *
 * Exists so no call site writes the `<script type="application/ld+json">`
 * boilerplate — or, more to the point, forgets the `<` escape that stops a
 * stray angle bracket in the data from closing the tag early. See `lib/schema.ts`.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
