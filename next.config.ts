import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Strict mode double-invokes effects in development. Kept on deliberately: it is
   * exactly what surfaces the WebGL context and IntersectionObserver leaks the 3D
   * hero would otherwise hide until production.
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
    /**
     * Case-study artwork is currently SVG. Next.js refuses to optimise SVG unless
     * this is set, because an SVG can carry scripts — so it is only safe while
     * every image is first-party, from `public/`. If remote or user-supplied images
     * are ever added, remove this and sanitise them instead.
     */
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    /* Belt and braces: blocks script execution even if an SVG is served inline. */
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
