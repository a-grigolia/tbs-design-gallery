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
      page.tsx              # the ONLY public page — the landing page
      styles.css            # Tailwind entry + all design tokens
    (payload)/              # Payload admin + REST/GraphQL, mostly generated
      admin/[[...segments]]/
      api/[...slug]/ , api/graphql/ , api/graphql-playground/
    my-route/               # leftover template scaffolding, safe to delete
  access/index.ts           # reusable Payload access-control predicates
  collections/              # Users, Media, Vendors, Posts
  components/landing/       # every marketing component
  fields/slug.ts            # shared auto-slug field
  hooks/revalidate.ts       # afterChange/afterDelete ISR invalidation
  lib/payload.ts            # cached getPayload() for server components
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
SiteHeader · Hero
SectionBand > BlueprintColumn > GallerySection · SectionRule 02 · SpecificationSection · SectionRule 03 · InstallationSection
SectionBand > BlueprintColumn > ProcessSection
SectionBand > BlueprintColumn > TestimonialsSection
SectionBand > BlueprintColumn > PartnersSection (vendors)
SectionBand > BlueprintColumn > SiteFooter
```

`export const revalidate = 300` — the page is ISR with a 5-minute window, on top of the
on-demand `revalidatePath` from the CMS hooks.

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
  Public read.
- **Vendors** — drafts enabled. Fixed `categories` select, `active` flag, logo/hero, gallery array,
  rich text `content` + legacy `contentHtml`, SEO fields.
- **Posts** — drafts enabled. `publishedAt` required and indexed, freeform `author` string, same
  `content`/`contentHtml` pairing.

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
`302:5622` (1728px wide). When syncing changes, pull `get_design_context` per section node rather
than the whole frame, and remember the Figma frame is desktop-only: responsive behaviour below
`lg` was invented in code and has no design reference.

## Gotchas

1. **`DATABASE_URI` must use Supabase's Session pooler (port 5432), not the Transaction pooler
   (6543).** Transaction mode breaks prepared statements and Drizzle fails at runtime in confusing,
   hard-to-trace ways.
2. **`pnpm test` currently fails.** `tests/e2e/frontend.e2e.spec.ts` is untouched Payload template
   scaffolding — it asserts the page title matches `/Payload Blank Template/` and that `h1` reads
   "Welcome to your new project." The real landing page has neither. The admin e2e specs and the
   Vitest integration spec are fine. Fix or delete that spec before trusting a green run.
3. **Most links on the page 404.** `/vendors`, `/vendors/[slug]`, `/blog`, and `/contact` are
   linked from `SiteHeader` (via `NAV_LINKS`), `SiteFooter` (via `FOOTER_COLUMNS`), `Hero`,
   `PartnersSection`, and `SpecificationSection` — including every "Request a tour" CTA — but
   `(frontend)` only implements `/`. Those routes are unbuilt, not broken.
4. **There are two unrelated category taxonomies.** The CMS `Vendors.categories` select is
   `kitchen-bath | windows-doors | outdoor-living | tile-stone | cabinetry`, while the landing
   page's `CATEGORIES` in `content.ts` is `custom-cabinetry | windows-doors | appliances |
outdoor-living`. They are not wired together and do not map 1:1. Don't assume editing one
   affects the other.
5. **Vendor category `value` strings are permanent database identifiers.** After launch, change
   only the `label`.
6. **`src/payload-types.ts` is generated.** Run `pnpm generate:types` after any collection edit;
   never hand-edit it.
7. **Media storage silently falls back to local disk** when `S3_BUCKET` is empty. Fine locally,
   never in a deployed environment — Vercel's filesystem is ephemeral and uploads vanish.
8. **No migrations directory.** Payload pushes schema changes straight to the database in dev. Be
   deliberate about collection changes against a shared database.
9. **`legacy-peer-deps=true`** in `.npmrc`, and `sharp`/`esbuild`/`unrs-resolver`/`workerd` need
   explicit build approval (`pnpm-workspace.yaml` `allowBuilds`, plus `onlyBuiltDependencies` in
   `package.json`).
10. **`next.config.ts` configures both webpack and Turbopack.** Next 16 dev uses Turbopack, so the
    `webpack` block only affects `pnpm build`.
11. **Next dev refuses a second server** for the same project directory and reports the running
    port. Check for an existing dev server before starting one.
12. **`pnpm build` needs the raised heap** (`--max-old-space-size=8000`) already set in the script.
13. **`src/redirects.ts` is intentionally empty** — reserved for the Webflow URL migration map,
    consumed by `next.config.ts`.
14. **`contentHtml` on Vendors and Posts holds raw imported Webflow HTML.** Don't hand-edit it; new
    content goes in the Lexical `content` field. Nothing renders it yet (see #3).
15. **`PROCESS_STEPS[0]` is the only step with an `image`.** `ProcessSection` destructures
    `[first, ...rest]` and gives the first step a wide two-column card. Adding images to other
    steps won't render without a layout change.
16. **`src/app/my-route/route.ts`** is leftover template scaffolding with an unused param. Harmless,
    but it is not a real endpoint.
