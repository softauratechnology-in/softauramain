# SoftAura Technology — Company Website

Marketing and lead-generation site for SoftAura Technology, a SaaS and enterprise
product engineering company. Six statically-prerendered routes, an animated
Motion hero, glassmorphism surfaces on a light canvas, an FAQ that emits
`FAQPage` structured data, and a server-validated contact form.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

```
/            Home       hero · services teaser · why us · work · CTA
/services    Services   4 primary services · supporting · process · how we build
/work        Work       case-study index
/work/[slug] Detail     one page per case study, statically generated
/faq         FAQ        native <details> accordion + FAQPage JSON-LD
/contact     Contact    booking card + server-validated enquiry form
```

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

Copy `.env.example` to `.env.local`. Every variable is documented in that file.

| Variable                  | Scope  | Required | Purpose                                                            |
| ------------------------- | ------ | -------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`    | Client | Yes      | Canonical origin for metadata, Open Graph, sitemap, robots          |
| `NEXT_PUBLIC_GA_ID`       | Client | No       | GA4 property. Falls back to the production ID; empty disables it    |
| `NEXT_PUBLIC_BOOKING_URL` | Client | No       | Scheduling link. Unset → BookingEmbed falls back to phone/WhatsApp  |
| `CONTACT_WEBHOOK_URL`     | Server | No       | Where enquiries are POSTed. Unset → logged to the console only      |

---

## Project structure

```
softaura-portfolio-main/
├── public/
│   ├── case-studies/         Case-study artwork (filenames don't match subjects —
│   │                         see the note in src/data/projects.ts)
│   └── google….html          Google Search Console verification file
├── src/
│   ├── app/                  App Router: layout, template, error, sitemap, robots
│   │   ├── services/         /services
│   │   ├── work/             /work and /work/[slug]
│   │   ├── faq/              /faq
│   │   ├── contact/          /contact
│   │   ├── actions/          Server Actions (contact form)
│   │   └── globals.css       Design tokens + base styles + custom utilities
│   ├── animations/           Motion variants and transitions
│   ├── components/
│   │   ├── cards/            Service, Project, Review, Feature, Process, TechStack
│   │   ├── hero/             HeroBackdrop (animated gradient + glass panels)
│   │   ├── layout/           Navbar, Footer, PageHeader, MotionProvider, PageTransition
│   │   ├── ui/               Button, Ripple, Card, Accordion, CountUp, MarqueeRow, StarRating, Icon, …
│   │   ├── visuals/          SystemDiagram — abstract decoration, never a mock product UI
│   │   ├── BookingEmbed.tsx
│   │   ├── ContactForm.tsx
│   │   └── WhatsAppWidget.tsx  Floating dual-region launcher (India / UAE)
│   ├── constants/            Site/company config, routes, contact-form contract
│   ├── data/                 All page content — services, projects, faq, process, …
│   ├── hooks/                useMediaQuery, useScrollLock, useScrollPosition
│   ├── lib/                  cn, polymorphic tag helpers
│   ├── sections/             One file per page section
│   └── styles/               colors.ts, typography.ts, themes.ts, theme.ts
├── .env.example
└── next.config.ts
```

### Where to change things

| To change…                     | Edit                                                            |
| ------------------------------ | --------------------------------------------------------------- |
| Services, case studies, FAQ    | `src/data/*.ts`                                                 |
| Company name, email, phones    | `src/constants/site.ts`                                         |
| Routes, nav links, anchors     | `src/constants/navigation.ts`                                   |
| Light/dark canvas              | `ACTIVE_THEME` in `src/styles/themes.ts` (one line)              |
| Brand colours                  | `src/styles/colors.ts` **and** the token block in `globals.css`  |
| Glass, glow, shadows, gradients | The derived-token block in `globals.css`                        |
| Type scale, spacing, motion    | `src/styles/typography.ts`, `src/styles/theme.ts`                |
| Home page section order        | `src/app/page.tsx`                                              |
| WhatsApp offices               | `contact.phones` in `src/constants/site.ts` (widget derives both) |
| Headline figures               | `src/data/stats.ts` — every value is computed, never typed      |
| Client reviews                 | `src/data/reviews.ts`; profile link via `googleBusinessUrl`    |
| Google Analytics               | `src/components/Analytics.tsx`; ID via `NEXT_PUBLIC_GA_ID`      |

> **Colour tokens are declared twice on purpose.** `globals.css` is what Tailwind
> utilities compile against; `colors.ts` is for JavaScript consumers (`theme-color`,
> and anything reading colours from JS). Change both, or they drift.

> **Theme-dependent values are derived, not hard-coded.** Glass tint, card shadow,
> glow strength, the headline gradient stops and the "quiet" brand tone all live in
> a derived-token block in `globals.css` and are recomputed per preset. A colour that
> only works on one canvas belongs there, not inline in a component.

---

## Architecture notes

**Server Components by default.** Every section, card and most UI primitives are
Server Components. Only five things opt into the client: the navbar, the reveal
wrappers, the animated headline, the hero backdrop and the contact form.
`<Button>` in particular stays server-side — every one of its states is pure CSS.

**The FAQ accordion is a native `<details>`.** Not a client component: the browser
already gets keyboard interaction, `aria-expanded` and find-in-page right, for no
JavaScript. It also means every answer is in the HTML whether open or closed, which
is what lets search engines and AI assistants read them. The open/close animation
uses `::details-content` (see `.accordion-panel` in `globals.css`) and degrades to
an instant toggle where that is unsupported.

**The hero is CSS and Motion, not WebGL.** An earlier build ran a three.js hero
behind a device-capability gate. It was replaced with `HeroBackdrop` — blurred
gradient fields and frosted panels — which removes `three`, `@react-three/fiber`
and `@react-three/drei` from the dependency tree entirely. Every animated property
is `transform` or `opacity`; blur is applied once to elements that never animate
their filter, because animating `filter: blur()` re-rasterises every frame.

**One animation library.** Motion (Framer) drives everything — declarative
reveals (`<Reveal>`, `<RevealGroup>`, `<AnimatedHeadline>`), the hero's
scroll-linked parallax, and the counters in `<CountUp>`. GSAP was a dependency
with no consumers and has been removed.

**Buttons stay server components.** `<Button>` renders no JavaScript of its own;
hover, focus and press-scale are pure CSS. The one client island is `<Ripple>`,
mounted *inside* the button, which listens for the press one level up through
`parentElement`. Primary buttons ripple from the pointer; secondary buttons get a
translucent sweep and a border ring instead, because their fill and label colour
are locked together for contrast and a directional repaint would strand the label
mid-transition.

**Reduced motion is handled centrally, with two exceptions.** `MotionProvider`
sets Framer's `reducedMotion: "user"` and `globals.css` clamps every CSS
animation, so declarative animation and anything CSS-driven inherits the
behaviour for free. Values *bound to scroll* are not animations in that sense —
the hero parallax and `<CountUp>` check `useAllowsMotion()` themselves.

**Glass surfaces are `@utility`, not plain classes.** Tailwind only generates
variants for utilities it knows about, so `surface-glass` and its siblings are
registered with `@utility` in `globals.css`. That is what makes
`lg:surface-glass` work — several components are a plain row on a phone and a
glass card on a wide screen, from one markup tree.

**Accessibility.** Skip link, visible focus rings, `aria-current="page"` on the
active nav item, `aria-expanded` and `Escape` handling on the mobile sheet, real
`<blockquote>`/`<figure>` for reviews, and `aria-invalid`/`aria-describedby`
wired automatically by `<Field>`. `<AnimatedHeadline>` splits text into one element
per word for the stagger, so it carries the whole sentence as `aria-label` and hides
the fragments — assistive tech reads one heading, not a word list.

---

## Before launch

Four things ship deliberately unfinished, each marked with a `TODO` in code:

1. **Contact delivery is not wired up.** Set `CONTACT_WEBHOOK_URL`, or implement
   `deliverEnquiry` in `src/app/actions/contact.ts` against your email provider.
   Until then an enquiry is validated, logged to the console and dropped — while the
   sender still sees a success message. Add rate limiting before the URL is public
   for long; the honeypot only stops naive bots. **This is the one that loses
   business if forgotten.**
2. **Reviews are not live yet.** `src/data/reviews.ts` ships with an empty array,
   so `ReviewsSection` renders nothing on either the home or contact page. The
   card treatment mimics a Google Business Profile review — stars, avatar, date —
   and that styling is a claim, so it must only ever carry text a real reviewer
   wrote. Transcribe reviews into the array and the section appears on its own;
   once Business Profile API access is approved, `scripts/sync-reviews.mjs` writes
   the same shape and the file becomes a reader over it. Also set
   `googleBusinessUrl` in `src/constants/site.ts` — without it the "See all reviews
   on Google" link is omitted, and that link is what lets a reader verify the
   quotes. **Do not add `aggregateRating` to the JSON-LD** — Google treats
   self-serving review markup on `Organization`/`LocalBusiness` as ineligible for
   star results; the reasoning is recorded in `src/data/reviews.ts`.
3. **Case-study artwork.** The stills in `public/case-studies/` are frames from
   screen recordings rather than clean product screenshots, and the filenames do not
   match their subjects — read the artwork note at the bottom of
   `src/data/projects.ts` before touching them. `stack` and `url` on each project are
   also unset, pending confirmation.
4. **Booking link.** `NEXT_PUBLIC_BOOKING_URL` is unset, so `<BookingEmbed>` falls
   back to phone and WhatsApp. Set it to a Cal.com/Calendly link to turn the card
   into a "pick a time" action.

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
3. Deploy. Every route prerenders as static — including each `/work/[slug]` case
   study via `generateStaticParams` — so the whole site is served from the CDN.

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

## Search Console

`public/google2f715258837cad55.html` is the Google Search Console verification
file. It is served verbatim at the site root by Next.js's static file handling.
Do not rename, edit or delete it — verification fails and the property is dropped.
