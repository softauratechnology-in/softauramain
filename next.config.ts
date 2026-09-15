import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Strict mode double-invokes effects in development. Kept on deliberately: it
   * is what surfaces listener and observer leaks — the scroll, pointer and
   * intersection subscriptions in `src/hooks` — before they reach production.
   */
  reactStrictMode: true,

  /* Hides the `X-Powered-By: Next.js` response header. */
  poweredByHeader: false,

  /**
   * Pins the workspace root.
   *
   * Without this, Turbopack walks up the tree, finds the lockfile in the parent
   * directory and infers *that* as the root — which would resolve modules and
   * tsconfig paths from the wrong place. Pinning it also silences the inference
   * warning on every build.
   */
  turbopack: {
    root: __dirname,
  },

  images: {
    /*
     * `dangerouslyAllowSVG` used to be set here, because the case studies were
     * illustrated with SVG placeholders. They are photographs now — `projects.ts`
     * points at `.jpg`/`.png`, and the three leftover SVGs were referenced by
     * nothing — so the flag has been removed along with them.
     *
     * That is worth more than it looks. The flag lets the image optimiser process
     * a format that can carry script; the CSP below was mitigating that rather
     * than preventing it. With no SVG to serve, the hazard is gone rather than
     * contained. Do not switch it back on without re-reading that trade.
     *
     * The CSP and `contentDispositionType` stay: they cost nothing and still
     * apply to anything the optimiser serves.
     */
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
