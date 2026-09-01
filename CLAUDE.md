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
   editable through Payload's admin. Nothing else is CMS-driven, on purpose.

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
      [category]/[slug]/    # vendor detail pages, e.g. /windows-doors/oikos
      not-found.tsx         # branded 404 (canvas bg, header, link home)
      styles.css            # Tailwind entry + all design tokens
    (payload)/              # Payload admin + REST/GraphQL, mostly generated
      admin/[[...segments]]/
      api/[...slug]/ , api/graphql/ , api/graphql-playground/
    my-route/               # leftover template scaffolding, safe to delete
  access/index.ts           # reusable Payload access-control predicates
  collections/              # Users, Media, Vendors, Posts
  components/landing/       # every landing-page component
  components/vendor/        # vendor detail page components
  fields/slug.ts            # shared auto-slug field
  hooks/revalidate.ts       # afterChange/afterDelete ISR invalidation
  lib/payload.ts            # cached getPayload() for server components
  lib/categories.ts         # VENDOR_CATEGORIES + vendorHref/categoryLabel/isVendorCategory
  lib/seo.ts                # Webflow-inherited vendor meta title/description patterns
  migrations/               # baseline Payload migration (see gotcha #9)
  payload.config.ts
  payload-types.ts          # GENERATED — never hand-edit
  redirects.ts              # empty; reserved for the Webflow URL map
```

Path aliases: `@/*` → `./src/*`, and `@payload-config` → `./src/payload.config.ts`.

## The frontend

### Page composition

`src/app/(frontend)/page.tsx` is a server component. It fetches published+active vendors, then
composes the page from a fixed sequence of sections wrapped in "blueprint" primitives:

```
Hero (embeds SiteHeader — see below)
SectionBand > BlueprintColumn > GallerySection · SectionRule 02 · SpecificationSection · SectionRule 03 · InstallationSection
SectionBand > BlueprintColumn > ProcessSection
SectionBand > BlueprintColumn > TestimonialsSection
SectionBand > BlueprintColumn > PartnersSection (vendors)
SectionBand > BlueprintColumn > SiteFooter
```

`export const revalidate = 300` — the page is ISR with a 5-minute window, on top of the
on-demand `revalidatePath` from the CMS hooks.

### Header + hero (Figma 624:5561)

- On the landing page `SiteHeader` renders **inside the Hero's side-bordered column**
  (`<SiteHeader embedded />`), stacked flush above the video with no gap, so the hairlines run
  to the top of the page. Vendor pages and the 404 render `<SiteHeader />` standalone.
- `embedded` mode positions the header `fixed` with an in-flow spacer holding its 60px slot —
  plain `sticky` would be trapped by the hero column and scroll away with it. Standalone mode
  stays `sticky`. Keep the spacer, header height, and bar height in lockstep (all 60px at rest).
- The bar has two states that CSS-transition: at rest 1216px / `32,8,8,8` padding / transparent;
  scrolled (>8px) 1184px / `32,6,6,6`, dropped 8px, hairline border, frosted.
- **The bar's frost lives on an absolutely-positioned sibling layer, not the bar itself.** A
  `backdrop-filter` on the bar would become the categories dropdown's backdrop root and kill the
  dropdown's own blur. Don't move the blur back onto the wrapper.
- The hero heading uses fluid type — `text-[clamp(2rem,1.25rem+2.5vw,3.25rem)]` (32→52px), no
  breakpoint jumps. The media box is 16:9 on `lg` (`lg:aspect-[1632/918]`), `min-h-[480px]` below.
- The hero video streams from public R2 via `NEXT_PUBLIC_MEDIA_URL`
  (`{NEXT_PUBLIC_MEDIA_URL}/renson-showcase-hd-1.mp4`, `preload="none"`, local poster). The env
  var must be set per environment — see gotcha #10.

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
- `VendorCta` — per-category Source Serif heading (map lives in the component) + "Contact us".
- `CategoryVendorGrid` — logo grid of all `active`+published vendors whose `categories` contains
  the URL category; the current vendor's cell is `bg-cream`, `aria-current`, and unlinked.
- `media.ts` — `asMedia()` / `mediaUrl(value, size)` helpers for narrowing `number | Media`.

`vendorHref(vendor)` in `src/lib/categories.ts` builds the canonical URL — use it for every
vendor link (the homepage `PartnersSection` already does).

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
  `INSTALLATION_CARDS`, `PROCESS_STEPS`, `TESTIMONIALS`, `FOOTER_COLUMNS`, `FOOTER_ADDRESS`.
- **Inline in each section's JSX** — headings, body paragraphs, eyebrow labels, CTA text, and the
  short service lists (`SHOWROOM_SERVICES` in `GallerySection`, `SERVICES` in
  `InstallationSection`, `NAV_LINKS` in `SiteHeader`).

Page `<title>`/description live in `(frontend)/layout.tsx`.

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
| `px-gutter` / `px-gutter-sm`       | 48px desktop / 24px mobile inset         |

Fonts are four Google families loaded in `layout.tsx` and exposed as tokens:

- `font-sans` → **Geist** — the body default, set on `body`.
- `font-display` → **Source Serif 4** — every `h1`/`h2`.
- `font-figtree` → **Figtree** — nav links, buttons, small caption/label text.
- `font-hanken` → **Hanken Grotesk** — the showroom services list only.

Dark mode: `next-themes` with `attribute="class"`, plus
`@custom-variant dark (&:where(.dark, .dark *))` so `dark:` utilities work off the class.
`<html>` has `suppressHydrationWarning`. `ThemeSwitcher` is a three-state pill (light/dark/system)
in the footer, and it renders with no active state until mounted to keep SSR markup stable.

### Component conventions

- **Server components by default.** `'use client'` only where there's state or an effect:
  `SiteHeader`, `SpecificationSection`, `InstallationSection`, `TestimonialsSection`,
  `ThemeSwitcher`, `Carousel`, `useCarouselTimer`.
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

- `Carousel` (`Carousel.tsx`) — auto-advancing crossfade; used by Gallery and Specification.
- `useCarouselTimer` — the shared rAF timer behind the above. Tracks `index` + a 0–1 `progress`,
  pauses via `IntersectionObserver` when off-screen, resets on manual select. `InstallationSection`
  uses it directly to drive its accordion.
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
`302:5622` (1728px wide); the nav+hero composition is node `624:5561`; the vendor detail
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
3. **Some links still 404.** `/vendors`, `/blog`, and `/contact` are linked from `SiteHeader`,
   `SiteFooter`, `Hero`, and `SpecificationSection` — including every "Request a tour" CTA — but
   remain unbuilt. Vendor detail pages exist at `/{primaryCategory}/{slug}` (build links with
   `vendorHref`); old `/vendors/[slug]`-style links are wrong, not just unbuilt.
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
16. **`src/redirects.ts` is intentionally empty** — reserved for the Webflow URL migration map,
    consumed by `next.config.ts`.
17. **`contentHtml` only exists on Posts now** (raw imported Webflow HTML; nothing renders it).
    It was removed from Vendors — vendor content is authored in the Lexical `content` /
    `productSpecifications` fields.
18. **`PROCESS_STEPS[0]` is the only step with an `image`.** `ProcessSection` destructures
    `[first, ...rest]` and gives the first step a wide two-column card. Adding images to other
    steps won't render without a layout change.
19. **`src/app/my-route/route.ts`** is leftover template scaffolding with an unused param. Harmless,
    but it is not a real endpoint.
