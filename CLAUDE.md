# CLAUDE.md

Working notes for AI agents on this repo. `README.md` is the human-facing setup guide and covers
the CMS/backend well; this file adds the frontend architecture, conventions, and the landmines that
aren't obvious from reading the code.

## What this project is

The rebuild of [tbsdesigngallery.com](https://tbsdesigngallery.com) — a marketing site for a
Santa Clara design showroom (windows, doors, cabinetry, appliances, outdoor living), migrating off
Webflow onto Payload 3 + Next.js 16.

It is really **two projects in one repo**, and the split is deliberate:

1. **A hardcoded marketing frontend.** The landing page is built from Figma and its copy lives in
   code, not the CMS. Navigation, footer, contact details, and all section prose are edited by
   changing `.tsx`/`.ts` files.
2. **A deliberately small CMS.** Only **Vendors** and **Posts** (plus their **Media**) are
   editorially managed. **Contact Submissions** is an operational, automatically populated
   collection rather than a source for marketing content.

Do not "helpfully" move hardcoded marketing copy into the CMS. That's a design decision, not an
oversight.

## Stack

| Layer           | Choice                                                                 | Notes                                      |
| --------------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| Framework       | Next.js `16.2.6` (App Router)                                          | Turbopack in dev                           |
| UI              | React `19.2.6`                                                         | Server Components by default               |
| Language        | TypeScript `5.7.3`, `strict: true`                                     | `noEmit` — Next/Vitest do the compiling    |
| CMS             | Payload `3.87.0`                                                       | Mounted inside the same Next app           |
| Database        | Postgres on Supabase via `@payloadcms/db-postgres`                     | Drizzle under the hood                     |
| Media storage   | Supabase Storage over its S3-compatible API (`@payloadcms/storage-s3`) | Falls back to local disk when unconfigured |
| Rich text       | `@payloadcms/richtext-lexical`                                         |                                            |
| Styling         | Tailwind CSS `4.3.3`                                                   | **No `tailwind.config`** — see below       |
| Theming         | `next-themes`                                                          | class strategy, light/dark/system          |
| Carousel        | `embla-carousel-react` (testimonials only)                             | other carousels are hand-rolled            |
| Images          | `sharp`                                                                | drives Payload's resize pipeline           |
| Tests           | Vitest (integration) + Playwright (e2e)                                |                                            |
| Package manager | pnpm                                                                   | `engines`: node `^18.20.2                  |     | >=20.9.0` |
| Deploy          | Vercel                                                                 | `vercel.json` pins the Next preset         |
| Address lookup  | Google Places Autocomplete Data API                                    | California addresses only                  |
| CRM delivery    | Zoho Flow webhook → Zoho CRM Leads                                     | Upserts Leads by email in Flow             |

## Commands

```sh
pnpm dev                    # dev server on :3000
pnpm devsafe                # dev server after nuking .next
pnpm build                  # production build (raises heap to 8 GB)
pnpm start                  # serve the production build
pnpm lint                   # eslint
pnpm test                   # test:int then test:e2e  (see gotcha #2 — currently fails)
pnpm test:int               # vitest, tests/int/**/*.int.spec.ts
pnpm test:e2e               # playwright, tests/e2e/
pnpm generate:types         # regenerate src/payload-types.ts  ← after ANY collection change
pnpm generate:importmap     # regenerate the admin import map
```

There is no typecheck script; use `npx tsc --noEmit -p tsconfig.json`.

## Layout

```
src/
  app/
    (frontend)/             # the public marketing site
      layout.tsx            # fonts, ThemeProvider, global metadata
      page.tsx              # the landing page
      contact/              # local-first contact form + server action
      [category]/[slug]/    # vendor detail pages, e.g. /windows-doors/oikos
      not-found.tsx         # branded 404 (canvas bg, header, link home)
      styles.css            # Tailwind entry + all design tokens
    (payload)/              # Payload admin + REST/GraphQL, mostly generated
      admin/[[...segments]]/
      api/[...slug]/ , api/graphql/ , api/graphql-playground/
      api/zoho/retry/       # CRON_SECRET-protected failed-delivery recovery
    my-route/               # leftover template scaffolding, safe to delete
  access/index.ts           # reusable Payload access-control predicates
  collections/              # Users, Media, Vendors, Posts, ContactSubmissions
  components/contact/       # contact form, CRM-aligned option lists, Calendly popup CTA
  components/landing/       # every landing-page component
  components/vendor/        # vendor detail page components
  fields/slug.ts            # shared auto-slug field
  hooks/revalidate.ts       # afterChange/afterDelete ISR invalidation
  lib/payload.ts            # cached getPayload() for server components
  lib/address.ts            # Google Place → structured California address
  lib/zoho.ts               # server-only Flow payload + delivery state
  lib/categories.ts         # VENDOR_CATEGORIES + vendorHref/categoryLabel/isVendorCategory
  lib/seo.ts                # Webflow-inherited vendor meta title/description patterns
  lib/tracking.ts           # GTM/Meta/Klaviyo IDs, live-domain gate, conversion events
  migrations/               # baseline Payload migration (see gotcha #9)
  payload.config.ts
  payload-types.ts          # GENERATED — never hand-edit
  redirects.ts              # Webflow → Next URL map (see gotcha #16)
```

Path aliases: `@/*` → `./src/*`, and `@payload-config` → `./src/payload.config.ts`.

## The frontend

### Page composition

`src/app/(frontend)/page.tsx` is a server component. It fetches published+active vendors, then
composes the page from a fixed sequence of sections wrapped in "blueprint" primitives:

```
SiteHeader · Hero
SectionBand > BlueprintColumn > GallerySection · SectionRule 02 · SpecificationSection · SectionRule 03 · InstallationSection
SectionBand > BlueprintColumn > ProcessSection
SectionBand > BlueprintColumn > TestimonialsSection
SectionBand > BlueprintColumn > PartnersSection (vendors)
SectionBand > BlueprintColumn > SiteFooter
```

`export const revalidate = 300` — the page is ISR with a 5-minute window, on top of the
on-demand `revalidatePath` from the CMS hooks.

### Product Specification showcase (Figma 624:5660)

`SpecificationSection` receives the homepage's active+published vendors and groups them by their
CMS `categories`; empty categories are hidden and names are alphabetical. Its five tabs use the
Figma SVGs in `public/landing/category-*.svg`, and each slide reuses `VendorHeroCard` with the
selected category label while linking to the vendor's canonical `vendorHref`. Rotation runs every
5 seconds and pauses while the category list or the card's caption bar is hovered, or anything in
the section has keyboard focus (there is no pause button); active names stay dark while the arrow
appears only on direct name hover.

### Header + hero (Figma 1052:412 desktop nav, 1061:1221 mobile nav, 677:6932 hero)

- `SiteHeader` is a page-level sibling above `Hero` on the landing page (same standalone
  `sticky` header as vendor pages and the 404). It is **not** inside the hero column.
- **Header height is `--header-height` in `styles.css`** (56px at every size). `Hero`'s
  `measure()` reads it and the category heroes `calc()` with it — change it there, never
  hardcode a header height. The hero frame's top hairline and `CategoryPage`'s band (`-mt-px`)
  sit on the header's last pixel row so they coincide with the bar's border instead of doubling.
- The bar is full-width. The content row (max 1216px, Figma's `32,8,8,8` inset done as
  symmetric `p-[8px]` + a 24px logo margin so the links' grid column centres on the full frame)
  never moves. At rest it's transparent (white text over the homepage hero via `overlayAtTop`);
  scrolled (>8px, or the hero's compact event) **or with the mega menu open** it crossfades in
  a frosted full-bleed layer with a bottom hairline.
- **The frost lives on an absolutely-positioned sibling layer whose `opacity` animates**, not on
  the row and not as an animated blur radius (janks on phones, and a `backdrop-filter` ancestor
  would become the mega menu's backdrop root).
- `CategoryMegaMenu` (Figma 1054:631) — five cards in `VENDOR_CATEGORIES` order, `top-[50px]`
  (overlaps the bar 6px per Figma). Opens on mouse hover (100ms/150ms intent delays), click
  (pins it open until outside click/Esc), or keyboard. The panel fades/drops in, then cards
  stagger in via inline `transitionDelay`; closing drops the stagger. Card hover: image zoom
  plus the arrow gliding into a circle — two Figma SVGs crossfading while sliding 4.17px.
- `MobileNavSheet` (Figma 1061:1554, below `md`) — a modal `<dialog>` (top layer above the
  header, built-in focus containment). It stays open through the slide-down, so close is driven
  by `open` → timeout → `dialog.close()`. Esc's `cancel` is intercepted to animate; Chrome may
  force-close on repeated Esc, which the `close` listener handles. Swipe-to-dismiss uses
  non-passive **touch** events (pointer streams get cancelled once the browser pans). Locks
  `<html>` overflow while open.
- Category photos for both come from `NAV_CATEGORY_IMAGES` in `content.ts` — hand-pasted public
  Supabase Media URLs; an empty string renders a neutral placeholder tile.
- The hero heading uses fluid type — `text-[clamp(2rem,1.25rem+2.5vw,3.25rem)]` (32→52px), no
  breakpoint jumps. The media box is **2:1** on `lg` (`lg:aspect-[2/1]`), `min-h-[480px]` below.
- The hero video streams from public R2 via `NEXT_PUBLIC_MEDIA_URL`
  (`{NEXT_PUBLIC_MEDIA_URL}/renson-showcase-hd-1.mp4`, `preload="none"`, local poster). A 20%
  black overlay sits over the video, under the heading. The env var must be set per environment
  — see gotcha #10.

### Vendor detail pages — `/{primaryCategory}/{slug}`

`src/app/(frontend)/[category]/[slug]/page.tsx` renders every vendor (e.g. `/windows-doors/oikos`)
from the Figma template (node `583:3078`). Key behaviors:

- `category` is validated against `VENDOR_CATEGORIES`; the vendor must be published **and**
  `vendor.primaryCategory` must equal the URL category, else `notFound()` — one page, one
  canonical URL. `active` is deliberately **not** checked here: inactive vendors stay resolvable
  at their URL, they're only excluded from listings (the logo grid, homepage).
- `generateStaticParams` prebuilds all published vendors; `dynamicParams` stays true so new
  vendors resolve without a redeploy. `revalidate = 300` like the homepage.
- Metadata: `seoTitle ?? vendorMetaTitle(name)` / `seoDescription ?? vendorMetaDescription(...)`
  from `src/lib/seo.ts` — those patterns carry the Webflow site's ranking history, don't reword.

Components in `src/components/vendor/` (all server components, same conventions as landing):

- `VendorHero` — rounded hero from `heroImage` (hero size), or an autoplaying `<video>` when
  `heroVideoUrl` is set; logo card + category eyebrow + name + `location` clustered bottom-left
  over a gradient. Falls back to a cream block (ink text) when there's no media.
- `TickRule` — `SectionRule`'s markup with a text label ("About Oikos") instead of a number.
- `VendorAbout` — `heading` + Lexical `content` (rendered with `RichText` from
  `@payloadcms/richtext-lexical/react`) left; `productSpecifications` flattened to right-aligned
  lines on the right. The extractor emits one line per **list item, paragraph, or shift+enter
  break** — a bullet list is the recommended CMS format for specs.
- `VendorGallery` — greedy two-column masonry balanced by cumulative aspect ratio (uses each
  Media's stored `width`/`height`); single column below `md`. "Visit {name}" pill under it from
  `externalUrl`. Every section hides itself when its field is empty.
- `VendorCta` — per-category `font-display` heading (map lives in the component) + "Contact us".
- `CategoryVendorGrid` — logo grid of all `active`+published vendors whose `categories` contains
  the URL category; the current vendor's cell is `bg-cream`, `aria-current`, and unlinked.
- `media.ts` — `asMedia()` / `mediaUrl(value, size)` helpers for narrowing `number | Media`.

### Category pages — `/{category}` (Figma 677:6066)

The five static routes (`windows-doors/page.tsx` etc.) only hold metadata, copy, and hero video
URLs; layout and data live in `components/vendor/CategoryPage.tsx`.

- The hero is a static copy of the homepage hero's _settled_ frame (no scroll animation): same
 gutters, 2:1 / 480px minimum, capped to fit the viewport — computed in CSS with `cqw`.
- The gallery is built from the CMS by `buildCategoryTiles` (`categoryTiles.ts`): each vendor's
 `heroImage` (so hero images now feed category galleries too), topped up from vendor `gallery`
 images to 6 photos when a category has fewer than 6 vendors. Extras split evenly; remainders
 and shortfalls go alphabetically; output interleaves vendors. 6+ vendors → one hero each.
- Tiles carry a `caption` (`LightboxGallery`): image opens the lightbox, the vendor name links to
 `vendorHref` with the hover arrow. The name link is a sibling of the zoom button, never a child.

`vendorHref(vendor)` in `src/lib/categories.ts` builds the canonical URL — use it for every
vendor link (the homepage `PartnersSection` already does).

### Contact form — `/contact`

- The form saves to `ContactSubmissions` first, then `after()` sends the durable row to Zoho Flow.
  A Zoho outage must never make the visitor re-enter an inquiry that was already stored locally.
- Address suggestions use `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and the modern Places Autocomplete
  Data API. Selection fetches `formattedAddress`, `addressComponents`, and the Google Place ID.
  A selected California address with street/city/zip is required; editing the text clears the
  structured selection. Do not replace this with comma-based parsing.
- `lib/zoho.ts` sends stable semantic keys and converts internal select slugs to display labels.
  Flow maps these to a **Create or update lead** action, which deduplicates by email. A 2xx webhook
  response means Flow accepted delivery; it does not make Payload a mirror of later CRM state.
- `zohoStatus`, attempts, last-attempt time, and last error make delivery auditable. The normal
  attempt runs immediately after the response. `/api/zoho/retry` retries up to 25 pending/failed
  rows and accepts `GET` (Vercel Cron) or `POST` (manual), both with
  `Authorization: Bearer {CRON_SECRET}`.
- `vercel.json` invokes recovery daily at 15:00 UTC because Vercel Hobby does not allow more
  frequent cron schedules. The Flow webhook and cron secret are server-only; neither may use a
  `NEXT_PUBLIC_` prefix.

### Journal (blog) — `/blog`

`blog/page.tsx` fetches published Posts newest-first; the newest becomes `JournalFeatured`, and all
of them (featured included) are listed by `JournalFeed`. Components live in `components/blog/`;
`labels.ts` holds the type labels (`project | guide | news`) and date formatters.

- **Filter pills are hidden, not removed** (decided 2026-10-13). `JournalFeed` has a pill tablist —
  Everything / Guides / Projects / News — that filters the list client-side by `post.type`. It's
  switched off with `const SHOW_FILTERS = false` at the top of `JournalFeed.tsx`; the markup,
  `FILTERS`, and filter state are all still there. To bring it back, flip the flag to `true`.
  While hidden, the filter stays on `everything`, so every post is listed.

### Tour booking — `/book`

Booking happens in **Calendly's popup**, not an inline embed (the inline iframe was too narrow for
Calendly's two-pane layout and turned the long intake form into a page-length scroll).
`/book` is a short landing page (visit details + "Pick a time") kept for its Webflow URL and
title/description — don't rename them.

- Every tour CTA (header, `/contact`, `PartnersSection`, `/book`) is `RequestTourLink`
  (`components/contact/`): a real `<Link href="/book">` whose plain click opens the popup instead.
  Modified clicks, crawlers, and no-JS still reach `/book`; if Calendly's script fails to load
  it navigates to the Calendly page itself.
- `widget.js` + `widget.css` load lazily on first hover/focus/click, once per session. The same
  load installs Esc-to-close (Calendly has none) and the `calendly.event_scheduled` listener
  that fires `trackTourBooked()`.
- The event URL (`CALENDLY_URL`, currently `calendly.com/tbsgallery/45min`) lives in that file.
  `book/page.tsx` repeats duration/address/hours/phone in site type — keep them in sync with
  the Calendly event.
- `background_color`/`text_color` mirror the canvas/ink palette per `resolvedTheme` at click
  time. Calendly only honours colour params on paid plans. `styles.css` forces
  `color-scheme: light` on the popup iframe, else dark mode paints a white backdrop around it.

### Tracking — GTM, Meta Pixel, Klaviyo

Ported from Webflow's site-wide custom code. `components/Tracking.tsx` (rendered in the frontend
root layout, so the Payload admin is never tracked) loads GTM `GTM-NR7TD5Q` and Meta Pixel
`344524082707566` after hydration and `klaviyo.js` (`X6j4PF`, drives the popup) when idle. The
`facebook-domain-verification` tag is static `metadata.other` in `layout.tsx`.

- **Scripts only load on `tbsdesigngallery.com` / `www.`** — the Webflow site shares these
  accounts until launch, so localhost and Vercel URLs stay silent. `?tracking=on` turns them on
  for that browser (persisted in localStorage), `?tracking=off` clears it. The gate runs
  client-side because ISR pages can't know the host; that's also why there's no `<noscript>`
  Pixel fallback.
- Next navigations don't reload the Pixel snippet, so `Tracking` sends `PageView` on each
  `pathname` change. GA4 relies on Enhanced Measurement's history-change page views, set in GA4.
- Conversions (`trackContactLead` / `trackTourBooked`): Meta `Lead` + dataLayer `generate_lead`
  on a successful contact submission (skipped for honeypot hits), Meta `Schedule` + dataLayer
  `tour_booked` on Calendly's `calendly.event_scheduled`. GTM needs Custom Event triggers to
  forward the dataLayer events. Both helpers no-op when the gate is closed. Explicit events are
  used because GTM's built-in form-submit trigger doesn't see this React form's submissions.
- If GTM's container also fires the Meta Pixel, PageViews double-count — keep it in one place.
  **Unverified:** nobody has audited GTM-NR7TD5Q's tags yet; check in Tag Assistant Preview.
- Klaviyo loads **once, site-wide**. Webflow also loaded it a second time on the homepage only;
  that duplicate was dropped on purpose. Which pages show the popup is Klaviyo form targeting
  (dashboard), not script placement.
- `facebook-domain-verification` renders on every host, ungated — it's inert markup and Meta's
  crawler needs it in the static HTML.
- **No consent handling, deliberately** (decided 2026-10-12): matches Webflow's behaviour. Under
  CCPA/CPRA the Meta Pixel counts as "sharing", so a "Do Not Sell or Share" opt-out and/or
  honouring Global Privacy Control is the likely follow-up — gate it in `isTrackingEnabled()`.
- **Testing before launch**: visit any local/Vercel URL with `?tracking=on`, then GTM Tag
  Assistant Preview (+ GA4 DebugView), the Meta Pixel Helper extension / Events Manager Test
  Events, and `window.klaviyo` + a private window for the popup. Test traffic hits the real
  accounts — keep it brief and delete test leads/bookings.
- **Launch needs no code change** — tracking switches on once the domain points at Vercel.
  Outstanding non-code setup: GA4 Enhanced Measurement "page changes based on browser history
  events" on, and GTM Custom Event triggers for `generate_lead` / `tour_booked`.

### Blueprint primitives (`components/landing/Blueprint.tsx`)

The design has a drafting/blueprint motif. These are **intentional visual elements, not debug
overlays** — don't strip them:

- `SectionBand` — full-bleed band with a top hairline; wraps a centered column.
- `BlueprintColumn` — the 1200px content column with hairline side borders and corner crosses.
- `CornerCross` — the small `+` marks at column corners.
- `SectionRule` — horizontal tick rule with a section number (`01`, `02`, `03`).
- `VerticalRule` — the upright variant used in the footer columns.
- `MeasureRule` — vertical measure with tick ends and a centered label (currently "What we do").

Note the inconsistency: `SectionRule number="01"` is rendered _inside_ `GallerySection`, while
`02` and `03` are rendered in `page.tsx`. Keep that in mind when reordering sections.

### Where copy lives

Two places, and you usually need to check both:

- **`components/landing/content.ts`** — the list-shaped content: `CATEGORIES`, `SHOWROOM_SLIDES`,
  `INSTALLATION_CARDS`, `PROCESS_STEPS`, `TESTIMONIALS`, `FOOTER_COLUMNS`, `FOOTER_ADDRESS`,
  `NAV_CATEGORY_IMAGES`.
- **Inline in each section's JSX** — headings, body paragraphs, eyebrow labels, CTA text, and the
  short service lists (`SHOWROOM_SERVICES` in `GallerySection`, `SERVICES` in
  `InstallationSection`, `NAV_LINKS` in `SiteHeader`, `SHEET_LINKS` in `MobileNavSheet`).

The homepage `<title>`/description are `metadata` in `(frontend)/page.tsx` (SEO-supplied copy —
don't reword); `(frontend)/layout.tsx` only holds the fallback for pages that set none. The share
image is `(frontend)/opengraph-image.jpg` + `twitter-image.jpg`, inherited by every page that
doesn't define its own `openGraph`. A page-level `openGraph` object drops that inheritance
entirely, so vendor and post metadata fall back to `DEFAULT_SHARE_IMAGE` (`src/lib/seo.ts`,
served from `public/og-image.jpg`) when they have no photo of their own.

### Design tokens — Tailwind v4, no config file

There is **no `tailwind.config.js/ts`**. Everything is CSS-first in
`src/app/(frontend)/styles.css` using `@theme` / `@theme inline`. Colors are declared as
light/dark `--palette-*` pairs, then aliased into Tailwind color tokens, so components never
branch on theme:

| Utility                            | Meaning                                  |
| ---------------------------------- | ---------------------------------------- |
| `bg-canvas`                        | page background                          |
| `text-ink`, `text-ink-70/50/40/30` | foreground at decreasing emphasis        |
| `border-hairline`                  | the 1px rules everywhere                 |
| `bg-cream`                         | raised/active surface (active pills)     |
| `text-gray-body`                   | process-card body text                   |
| `bg-brand`, `border-brand-glow`    | brand red — **identical in both themes** |
| `pt-section` / `pb-section`        | 96px section rhythm                      |
| `pb-heading-gap`                   | 64px heading-to-content gap              |
| `px-gutter` / `px-gutter-sm`       | 48px desktop / 16px mobile inset         |

The site is **single-family: only Geist** is loaded in `layout.tsx`. The four font tokens still
exist (and are used throughout the JSX) but all resolve to Geist in `styles.css`, so they now
mark roles rather than typefaces:

- `font-sans` — the body default, set on `body`.
- `font-display` — every `h1`/`h2` (formerly Source Serif 4).
- `font-figtree` — nav links, buttons, small caption/label text (formerly Figtree).
- `font-hanken` — the showroom services list (formerly Hanken Grotesk).

Dark mode: `next-themes` with `attribute="class"`, plus
`@custom-variant dark (&:where(.dark, .dark *))` so `dark:` utilities work off the class.
`<html>` has `suppressHydrationWarning`. `ThemeSwitcher` is a three-state pill (light/dark/system)
in the footer, and it renders with no active state until mounted to keep SSR markup stable.

### Component conventions

- **Server components by default.** `'use client'` only where there's state or an effect:
  `SiteHeader`, `CategoryMegaMenu`, `MobileNavSheet`, `SpecificationSection`,
  `InstallationSection`, `TestimonialsSection`, `ThemeSwitcher`, `Carousel`, `useCarouselTimer`,
  `RequestTourLink`, `Tracking`.
- **Plain `<img>`, not `next/image`**, with an `{/* eslint-disable-next-line
@next/next/no-img-element */}` above each one. This is the established pattern across every
  landing component — follow it rather than converting to `next/image`.
- **Monochrome SVGs get `dark:invert`** (logo, icons, tick marks) instead of a second asset.
  **Vendor logos do NOT** — they're full-color uploads (inverting a red logo makes it cyan);
  they render `max-h-[48px] w-full object-contain` in grids, no invert.
- **Exact pixel values in arbitrary Tailwind brackets** (`gap-[24px]`, `text-[14px]`,
  `leading-[22px]`, `rounded-[44px]`) because everything is traced from Figma. Don't "round" these
  to Tailwind's default scale.
- Named function exports (`export function Hero()`), no default exports in `components/landing`.

### Carousels

Three different mechanisms — pick the matching one:

- `Carousel` (`Carousel.tsx`) — auto-advancing crossfade; used by Gallery.
- `useCarouselTimer` — the shared rAF timer behind the above. Tracks `index` + a 0–1 `progress`,
  pauses via `IntersectionObserver` when off-screen, accepts an explicit pause state, and resets on
  manual select. `SpecificationSection` and `InstallationSection` use it directly.
- `embla-carousel-react` — testimonials only, because it needs drag plus a custom `align` that
  pins the first card to the section gutter.

`CarouselDots` renders the width-animating pill dots and fills the active one with `progress`.

## The CMS

### Collections

- **Users** — Payload auth. `role` is `admin | editor`, saved to the JWT. Field-level access stops
  editors promoting themselves.
- **Media** — `alt` required. Generates `thumbnail` (400w), `card` (800w), `hero` (1920w) WebP.
  Public read. URLs point **directly at the public Supabase bucket** (CDN), not at
  `/api/media/file/...` — see gotcha #7. Name uploads `{vendor-slug}-{description}.{ext}`
  (e.g. `oikos-alicante-01.jpg`) so the flat bucket stays navigable.
- **Vendors** — drafts enabled. `categories` (multi, drives listings) + `primaryCategory`
  (single, drives the canonical URL — pick once, changing it breaks the live URL), `active` flag,
  logo/hero/`heroVideoUrl`, `heading`, rich text `content`, `productSpecifications` (rich text,
  rendered as one line per list item/paragraph), `gallery` (single `hasMany` upload field),
  `location`, `externalUrl`, SEO overrides. **`logo` is the logo, `heroImage` is the banner
  photo** — they've been swapped by hand before; double-check on entry.
- **Posts** — drafts enabled. `publishedAt` required and indexed, freeform `author` string,
  `content` + legacy `contentHtml`.
- **ContactSubmissions** — admin-only inquiry capture and the local source of truth for CRM
  delivery. Stores full + structured Google address data and Zoho delivery metadata. The server
  action writes rows with Local API access override; public REST/GraphQL access remains closed.

### Access control (`src/access/index.ts`)

`isAdmin`, `isAdminOrEditor`, `isAdminOrSelf`, `isLoggedInOrPublished`, `isAdminFieldLevel`.
The shape across Vendors/Posts is: read = `isLoggedInOrPublished` (public sees published only),
create/update = `isAdminOrEditor`, **delete = `isAdmin`**. Reuse these; don't inline new predicates.

### Slugs (`src/fields/slug.ts`)

`slugField(sourceField)` auto-fills from the source field **only when empty**. An existing slug is
never regenerated on update — retitling must not break a live URL. Slugs are `required` + `unique`

- indexed.

### Revalidation (`src/hooks/revalidate.ts`)

`revalidateAfterChange(basePath)` / `revalidateAfterDelete(basePath)` invalidate the index and the
detail path. They handle unpublishing and slug changes by also clearing the _previous_ URL. Draft
saves are ignored. `revalidatePath` is wrapped in try/catch because it throws outside a Next
request context (Payload CLI, scripts).

### Reading data

From server components use the cached client, which dedupes within a request:

```ts
import { getPayload } from '@/lib/payload'
const payload = await getPayload()
```

**Document IDs are numbers**, not strings (Postgres serial). Relationship fields come back as
`number | Media`, so narrow before use — see `logoUrl()` in `PartnersSection.tsx` for the pattern.

## Conventions

- **Prettier**: single quotes, no semicolons, trailing commas, 100 col. Format on save is wired up
  in `.vscode/settings.json` along with eslint autofix.
- **ESLint**: `eslint-config-next` core-web-vitals + typescript. `no-explicit-any`,
  `ban-ts-comment`, `no-empty-object-type` are warnings, not errors. `_`-prefixed identifiers are
  exempt from unused-vars. `src/payload-types.ts` is ignored.
- **Imports**: type imports first, then external, then internal — roughly matching existing files.
- **Comments** explain _why_ (a Figma constraint, a Payload quirk, a hydration workaround), never
  what the next line does. Existing comments are a good model; match that density.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`) — the recent history
  follows this, older commits don't.

## Design source

The landing page traces a Figma file:
`https://www.figma.com/design/qKXOF8QC1eHei7MnD2Kutd/` — the desktop landing frame is node
`302:5622` (1728px wide); the nav+hero composition is node `677:6932`; the vendor detail
template is node `583:3078`. When syncing changes,
pull `get_design_context` per section node rather than the whole frame, and remember the Figma
frames are desktop-only: responsive behaviour below `lg` was invented in code and has no design
reference. Watch for placeholder-derived values: the grid's `aspect-[499/75]` logo box was just
the placeholder logo's own ratio and squashed real logos — generalize (`max-h` + `object-contain`)
rather than copying placeholder dimensions.

## Gotchas

1. **`DATABASE_URI` must use Supabase's Session pooler (port 5432), not the Transaction pooler
   (6543).** Transaction mode breaks prepared statements and Drizzle fails at runtime in confusing,
   hard-to-trace ways.
2. **`pnpm test` currently fails.** `tests/e2e/frontend.e2e.spec.ts` is untouched Payload template
   scaffolding — it asserts the page title matches `/Payload Blank Template/` and that `h1` reads
   "Welcome to your new project." The real landing page has neither. The admin e2e specs and the
   Vitest integration spec are fine. Fix or delete that spec before trusting a green run.
3. **`/vendors` remains unbuilt.** Vendor detail pages exist at `/{primaryCategory}/{slug}` (build
   links with `vendorHref`); old `/vendors/[slug]`-style links are wrong, not just unbuilt.
4. **There are two category taxonomies.** The CMS taxonomy lives in `src/lib/categories.ts`
   (`custom-cabinetry | windows-doors | outdoor-living | appliances |
architectural-elements-furniture`) — its values are simultaneously the Postgres enum values
   and the public URL segments. The landing page's `CATEGORIES` in `content.ts` is a separate,
   unwired list. Don't assume editing one affects the other.
5. **Vendor category `value` strings are permanent identifiers** (enum values + live URLs,
   inherited from Webflow). After launch, change only the `label` — never the `value`.
6. **`src/payload-types.ts` is generated.** Run `pnpm generate:types` after any collection edit;
   never hand-edit it.
7. **Media serves directly from the public Supabase bucket, not through Payload.** The `media`
   bucket is public; `payload.config.ts` sets `disablePayloadAccessControl` + `generateFileURL`
   so every Media URL is `{SUPABASE}/storage/v1/object/public/media/{file}`. This is deliberate:
   the old `/api/media/file/...` proxy needed a DB connection per image and randomly 500'd under
   parallel image loads (see #8). Consequences: files must actually exist in the bucket (uploads
   go there automatically now), and anything uploaded to Media is publicly reachable by URL.
   When `S3_BUCKET` is unset, storage still silently falls back to local disk — fine for offline
   hacking, never in deployed environments.
8. **The Supabase session pooler allows 15 database clients TOTAL — shared by local dev, scripts,
   and every Vercel function instance.** Exceeding it throws `EMAXCONNSESSION` at Payload init
   and pages 500. Mitigations already in place: `pool.max: 4` in `payload.config.ts` (Next dev
   runs `generateStaticParams` in a separate worker process with its own pool), media served
   off-DB (see #7). Zombie `tsx`/dev-server processes hold connections — kill strays if you see
   `EMAXCONNSESSION`, and note killed Vercel lambdas release theirs lazily (give it a minute).
9. **Drizzle dev push is disabled** (`push: false` in `payload.config.ts`) — it re-introspected
   the schema on every process init, hogged pooler clients, and hangs forever on its interactive
   create-vs-rename prompt in non-TTY contexts. Schema changes are now deliberate: edit the
   collection, apply DDL explicitly (or temporarily flip `push` back on in a real TTY), run
   `pnpm generate:types`. `src/migrations/` holds a baseline migration for fresh databases;
   `payload migrate` is NOT in the build script (it would prompt/hang on Vercel).
10. **Environment variables live in two places and don't sync.** Local `.env` is gitignored and
    never reaches Vercel; the Vercel project envs are set independently (`vercel env add`).
    Production currently has `DATABASE_URI`, `PAYLOAD_SECRET`, and all five `S3_*` vars;
    **Preview has no `S3_*` vars** — preview deploys will silently fall back to local disk (#7).
    An empty `S3_BUCKET` disables S3 without erroring, so a missing var looks like broken images,
    not a config failure. `NEXT_PUBLIC_MEDIA_URL` (public R2 origin for the hero video, no
    trailing slash) is set in local `.env` but **not yet on Vercel** — until it is, deployed
    heroes render only the poster. It's inlined at build time, so setting it requires a fresh
    build, not just `vercel redeploy`.
11. **Production now builds from git** — the Vercel project is connected to
    `github.com/a-grigolia/tbs-design-gallery` and builds `main` on push, so **uncommitted local
    changes never ship**; commit and push first. The project is also linked in `.vercel/`, so
    `vercel --prod` from the local directory still works and CAN ship uncommitted state — prefer
    the git path. Env var changes only take effect on the next deployment (`vercel redeploy <url>`
    re-ships the same build with new envs — which won't pick up `NEXT_PUBLIC_*` changes, see #10).
12. **`legacy-peer-deps=true`** in `.npmrc`, and `sharp`/`esbuild`/`unrs-resolver`/`workerd` need
    explicit build approval (`pnpm-workspace.yaml` `allowBuilds`, plus `onlyBuiltDependencies` in
    `package.json`).
13. **`next.config.ts` configures both webpack and Turbopack.** Next 16 dev uses Turbopack, so the
    `webpack` block only affects `pnpm build`.
14. **Next dev refuses a second server** for the same project directory and reports the running
    port. Check for an existing dev server before starting one.
15. **`pnpm build` needs the raised heap** (`--max-old-space-size=8000`) already set in the script.
16. **`src/redirects.ts` is the Webflow URL migration map** (~90 permanent rows, built from the
    Webflow sitemap of 2026-10-13), consumed by `next.config.ts`. Next runs redirects **before**
    routes, so a row shadows any real page at that path: when an old blog post is migrated into
    Payload, delete its `/blog/...` row or the new page is unreachable. Wildcards (`:slug`) are
    only for retired prefixes — never wildcard an active category. Destinations must be final
    pages, never another source. Redirects are read at server startup, so restart `pnpm dev`
    after editing. `pnpm test:e2e tests/e2e/redirects.e2e.spec.ts` checks all of the above plus
    a live 308 → 200 for every row (`REDIRECT_BASE_URL=https://…` to run it against a deploy).
17. **`contentHtml` only exists on Posts now** (raw imported Webflow HTML; nothing renders it).
    It was removed from Vendors — vendor content is authored in the Lexical `content` /
    `productSpecifications` fields.
18. **`PROCESS_STEPS[0]` is the only step with an `image`.** `ProcessSection` destructures
    `[first, ...rest]` and gives the first step a wide two-column card. Adding images to other
    steps won't render without a layout change.
19. **`src/app/my-route/route.ts`** is leftover template scaffolding with an unused param. Harmless,
    but it is not a real endpoint.
20. **Contact delivery has three environment variables with different exposure rules.**
    `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is intentionally browser-visible and must be restricted by
    Google HTTP referrers plus Maps JavaScript/Places APIs. `ZOHO_FLOW_WEBHOOK_URL` contains a
    `zapikey`, and `CRON_SECRET` authorizes retries; both are server-only Vercel Secrets. Local
    `.env` and Vercel do not sync. The contact/address migrations were applied to the current
    Supabase database on 2026-09-11, but fresh databases still need `pnpm payload migrate`.
