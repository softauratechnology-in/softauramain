# Softaura Technology — Company Website

Marketing and lead-generation site for Softaura Technology, a SaaS and enterprise
product engineering company. Single-page composition with a WebGL hero, scroll
motion throughout, and a server-validated contact form.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

---

## Quick start

Requires **Node.js 20.9+**.

```bash
npm install
cp .env.example .env.local   # then edit NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

## Scripts

| Command             | Does                                                    |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                              |
| `npm run build`     | Production build                                        |
| `npm start`         | Serve the production build (run `build` first)           |
| `npm run lint`      | ESLint                                                  |
| `npm run lint:fix`  | ESLint with autofix                                     |
| `npm run typecheck` | `tsc --noEmit`                                          |
| `npm run check`     | Typecheck + lint + build — run this before merging       |

## Environment variables

Copy `.env.example` to `.env.local`. Both variables are documented in that file.

| Variable               | Scope  | Required | Purpose                                                       |
| ---------------------- | ------ | -------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Client | Yes      | Canonical origin for metadata, Open Graph, sitemap, robots     |
| `CONTACT_WEBHOOK_URL`  | Server | No       | Where enquiries are POSTed. Unset → logged to the console only |

---

## Project structure

```
softaura-portfolio-main/
├── public/
│   └── case-studies/         Case-study artwork (placeholder SVGs — see below)
├── src/
│   ├── app/                  App Router: layout, page, template, error, sitemap, robots
│   │   ├── actions/          Server Actions (contact form)
│   │   └── globals.css       Design tokens + base styles + custom utilities
│   ├── animations/           GSAP setup, Framer Motion variants, parallax hook
│   ├── components/
│   │   ├── cards/            Service, Project, Testimonial, Feature, Process, TechStack
│   │   ├── layout/           Navbar, Footer, CustomCursor, SmoothScroll, MotionProvider
│   │   ├── three/            HeroCanvas (capability gate) + HeroScene (WebGL)
│   │   ├── ui/               Button, Card, Container, Icon, Field, Marquee, Reveal, Tag
│   │   └── ContactForm.tsx
│   ├── constants/            Site/company config, navigation, contact-form contract
│   ├── data/                 All page content — services, projects, tech, process, …
│   ├── hooks/                useMediaQuery, useScrollLock
│   ├── lib/                  cn, polymorphic tag helpers
│   ├── sections/             One file per page section
│   └── styles/               colors.ts, typography.ts, theme.ts (design system)
├── .env.example
├── information.md            Full technical + design documentation
└── next.config.ts
```

### Where to change things

| To change…                    | Edit                                                            |
| ----------------------------- | --------------------------------------------------------------- |
| Services, case studies, stack | `src/data/*.ts`                                                 |
| Company name, email, phones   | `src/constants/site.ts`                                         |
| Nav links, section anchors    | `src/constants/navigation.ts`                                   |
| Brand colours                 | `src/styles/colors.ts` **and** the token block in `globals.css`  |
| Type scale, spacing, motion   | `src/styles/typography.ts`, `src/styles/theme.ts`                |
| Section order                 | `src/app/page.tsx`                                              |

> **Colour tokens are declared twice on purpose.** `globals.css` is what Tailwind
> utilities compile against; `colors.ts` is for JavaScript consumers (three.js
> materials and lights, `theme-color`). Change both, or they drift.

---

## Architecture notes

**Server Components by default.** Every section, card and UI primitive is a Server
Component. Only five things opt into the client: the navbar, the custom cursor,
smooth scroll, the reveal wrappers, and the contact form. `<Button>` in particular
stays server-side — its hover states are pure CSS, and the magnetic cursor effect is
opted into with a `data-magnetic` attribute that the global cursor picks up by
selector.

**The 3D hero is gated, then lazy.** `HeroCanvas` probes device capability (cores,
memory, viewport width, Save-Data, a real WebGL context) before deciding. Devices
that fail the check render an animated CSS orb and **never download** the ~890 KB
three.js chunk. When it does load, the render loop pauses via
`IntersectionObserver` once the hero scrolls away — and the canvas stays mounted
rather than being torn down and rebuilt on every pass.

**Two animation libraries, split by job.** Framer Motion drives declarative
enter/reveal animation (`<Reveal>`, `<RevealGroup>`). GSAP drives imperative,
scroll-linked work (parallax, the full-bleed showcase scrub, the cursor). Lenis is
wired into GSAP's ticker in `SmoothScroll` so ScrollTrigger and smooth scroll share
one clock — without that, scrub animations visibly lag the content.

**Reduced motion is handled centrally.** `MotionProvider` sets Framer's
`reducedMotion: "user"`, GSAP effects are gated with `gsap.matchMedia`, and CSS
animations are neutralised in `globals.css`. Individual components do not each
re-check the preference.

**Accessibility.** Skip link, visible focus rings, `aria-current` on the active nav
item, `aria-expanded` and `Escape` handling on the mobile sheet, real
`<blockquote>`/`<figure>` for testimonials, and `aria-invalid`/`aria-describedby`
wired automatically by `<Field>`. The 3D canvas is `aria-hidden` — the headline
carries the meaning.

---

## Before launch

Three things ship deliberately unfinished, each marked with a `TODO` in code:

1. **Testimonials are sample content.** `src/data/testimonials.ts` holds
   illustrative quotes with fictional attribution, and the section renders a visible
   "sample content" notice. Replace with approved client quotes and set
   `TESTIMONIALS_ARE_PLACEHOLDER = false`. To launch without the section, set
   `testimonials = []` — it then renders nothing at all.
2. **Case-study artwork is placeholder gradients** in `public/case-studies/`.
   Replace with real screenshots. `stack` and `url` on each project in
   `src/data/projects.ts` are also unset, pending confirmation.
3. **Contact delivery is not wired up.** Set `CONTACT_WEBHOOK_URL`, or implement
   `deliverEnquiry` in `src/app/actions/contact.ts` against your email provider. Add
   rate limiting before the URL is public for long — the honeypot only stops naive
   bots.

Also outstanding: social profile URLs in `src/constants/site.ts` (entries with a
`null` href render nothing), and an Open Graph image — add
`src/app/opengraph-image.tsx` or a 1200×630 `opengraph-image.png` and Next.js picks
it up by convention.

---

## Deployment

### Vercel (recommended)

1. Import the repository. The Next.js preset is detected; no build overrides needed.
2. Set `NEXT_PUBLIC_SITE_URL` to the production domain (no trailing slash), plus
   `CONTACT_WEBHOOK_URL` if delivery is configured. Set them for **Production**,
   **Preview** and **Development** separately — a preview deploy inheriting the
   production URL emits wrong canonical tags.
3. Deploy. All four routes prerender as static, so the site is served from the CDN.

### Any Node host

```bash
npm ci
npm run build
npm start          # serves on $PORT, default 3000
```

Run behind a reverse proxy terminating TLS.

### Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
```

`NEXT_PUBLIC_SITE_URL` must be present **at build time** — `NEXT_PUBLIC_*` values
are inlined into the bundle, so supplying it only at runtime has no effect.

---

## Documentation

`information.md` holds the full technical and design record: token values, component
inventory, motion specification, content map and performance budget.
# softaura-main-1
