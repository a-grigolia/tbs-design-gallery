# MIGRATION.md

Working notes for the Webflow → Payload migration. Companion to `CLAUDE.md`, which covers the
existing architecture. Delete this file once the site is live and stable.

**Target cutover: Wednesday, September 9, 2026.** Hard deadline September 11. Never launch on a
Friday.

## The core decision

Vendor URLs stay **exactly where Webflow has them**. They are not moving to `/vendors/[slug]`.

```
/windows-doors                      category index          unchanged
/windows-doors/reynaers             vendor detail           unchanged
/blog                               blog index              unchanged
/blog/renson-outdoor-structures     post detail             unchanged
```

Every category page, every vendor page, and every blog post keeps its current URL. That collapses
the redirect map to four rows. The safest redirect is the one you never write.

`/vendors` does not exist. Navigation becomes a dropdown listing the five categories.

### The five categories

Permanent value strings. These are simultaneously the Postgres enum values and the URL segments.
They match the live Webflow collection page paths exactly.

```
custom-cabinetry
windows-doors
outdoor-living
appliances
architectural-elements-furniture
```

## Schema changes

All three must land **while the vendors table is empty**. Postgres will not drop enum values that
are in use.

| Change | Field | Why |
| ------ | ----- | --- |
| Replace enum values | `Vendors.categories` | Old values (`kitchen-bath`, `tile-stone`, `cabinetry`) don't exist on the live site. Resolves `CLAUDE.md` gotcha #4. |
| `hasMany: true` | `Vendors.categories` | Renson and Laura Meroni each appear in two Webflow collections. Without this they silently lose one on import. |
| **New field** | `Vendors.primaryCategory` | Single select, required, same enum. Determines the canonical URL. |

`categories` controls **listing** — which category pages show this vendor.
`primaryCategory` controls **URL** — where its one canonical page lives.

Renson gets `categories: ['outdoor-living', 'windows-doors']` and
`primaryCategory: 'outdoor-living'`. It's listed on both index pages, but every link points at
`/outdoor-living/renson`. One page, one URL — which is what Webflow currently gets wrong.

After the edit: `pnpm generate:types`, then verify the enum in the Supabase SQL editor.

### Open TODO

`primaryCategory` for **Renson** and **Laura Meroni** is undecided. Pull both old URLs in Search
Console, take whichever has more clicks. The loser gets a 301 to the winner. That's the only
per-vendor redirect on the project.

## Storage

**Supabase for everything.** Postgres for rows, Supabase Storage for files, via the already-configured
`@payloadcms/storage-s3`. No second provider, no DNS changes, no custom media domain.

At this site's scale — ~200 assets, one hero video — egress sits at a few percent of what the
Supabase Pro and Vercel Pro plans already include. Splitting media across a second provider would
buy nothing and cost a nameserver migration.

Credentials come from Supabase dashboard → **Storage → S3 Connection**. Separate from the Postgres
connection string.

**Verify one upload end-to-end before importing anything.** Gotcha #7: storage silently falls back
to local disk when `S3_BUCKET` is empty, and Vercel's filesystem is ephemeral, so uploads vanish on
the next deploy. Upload through `/admin`, confirm the original plus three WebP variants land in the
bucket, confirm the URL renders, then delete and confirm all four objects disappear. That last check
catches deletes not reaching storage, which otherwise accumulates orphans silently.

Set the `S3_*` vars in **Vercel** as well as locally — Production, Preview, and Development.

### Hero video

Not a CMS asset. Stays in `public/`, served off Vercel's CDN. Re-encode before launch:

```sh
ffmpeg -i input.mov -an \
  -vf "scale=1920:-2" \
  -c:v libx264 -crf 26 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  hero.mp4
```

`-an` strips audio (smaller, and sidesteps autoplay policy). `+faststart` matters — without it
playback waits for a full buffer. Target under 3 MB. Add a poster frame and serve **only** the
poster on mobile.

## Import pipeline

Three scripts. Steps 1 and 2 write nothing, so you can inspect the output, fix the mapping, and
re-run for free. Only step 3 touches the database or the bucket.

```
scripts/
  1-dump.ts       Webflow API → migration/raw/*.json           (read-only)
  2-transform.ts  raw → Payload shape, dedupe, HTML→Lexical    (read-only)
  3-load.ts       media upload + payload.create()              (writes)
```

Use the Payload **Local API** (`payload.create()`), not REST.

### Webflow source

Five CMS collections, one per category — that's why the URLs nest. Plus a Posts collection. Package
is `webflow-api` (v2 SDK, exports `WebflowClient`); verify method names against the docs rather than
assuming. Site token needs `cms:read` and `assets:read`.

Webflow v2 nests content under `fieldData`; field slugs won't match Payload field names.

**Dump all five collection schemas and diff them before writing mapping code.** They will have
drifted — someone added a field to one collection and never backfilled the others.

### Dedupe

A brand in two Webflow collections is two URLs competing for the same ranking signal. Flattening to
one page consolidates that. Match on brand name, merge the category arrays, produce one vendor doc.
Expected duplicates: **Renson, Laura Meroni.** Two records is small enough to hand-verify.

### Slugs

Preserve Webflow slugs **verbatim**. They carry the inbound links and ranking history.

`laura-meroni` is hyphenated even though the brand styles itself "Laurameroni" — slug and `name` are
separate fields. `slugField` only auto-fills when empty (`src/fields/slug.ts`), so passing an
explicit slug on create is safe.

### Body content

Webflow rich text arrives as an HTML string. Do both:

- Raw HTML → `contentHtml`, untouched archive, nothing renders it (gotcha #14).
- Converted → Lexical `content`. Skip this and Liana and Mamuka can't edit a single migrated post.

**Images inside post bodies must become Lexical upload nodes, not `<img>` tags with hardcoded URLs.**
Upload nodes are real relations, so the media host resolves at render time and hosting stays a
config value instead of something baked into 50 post bodies. This is the difference between "we can
change storage later" and "we can't."

Conversion is lossy on embeds and Webflow-specific components. Budget time to hand-fix the top ~10
posts by Search Console traffic.

### Media

Every asset URL points at Webflow's CDN, which dies when the plan is cancelled. Step 3 downloads
each one, uploads through Payload, and caches the mapping to disk so a partial run resumes instead
of re-downloading. **Verify zero remaining `website-files.com` URLs before cutover.**

### Idempotency

Upsert by slug. Without it, a failure on item 23 of 80 followed by a re-run produces 22 duplicates.

The vendors table currently holds Payload test uploads (`laurameroni`, `heatsail`). Truncate before
loading.

## Redirects

`src/redirects.ts`, consumed by `next.config.ts` (gotcha #13). All `permanent: true` — 301, never
302.

```
/homeowners                     → /
/trade-professionals            → /
/{loser}/renson                 → /{winner}/renson
/{loser}/laura-meroni           → /{winner}/laura-meroni
```

That's the whole map. Everything else keeps its URL.

**On the two dropped pages:** Google largely treats redirect-to-homepage as a soft 404 and passes
little equity. `/trade-professionals` is the architect and GC channel — the highest-intent traffic on
the old site. `/contact` is a topically relevant destination for the same effort if you reconsider.

## Routing

```
src/app/(frontend)/
  page.tsx                    → /
  blog/page.tsx               → /blog
  blog/[slug]/page.tsx        → /blog/{slug}
  contact/page.tsx            → /contact
  [category]/page.tsx         → /windows-doors
  [category]/[slug]/page.tsx  → /windows-doors/reynaers
```

1. **`[category]` is greedy at the root.** Without a guard, `/anything` matches it.
   `generateStaticParams` returns the five slugs, plus `export const dynamicParams = false`, so
   unknown roots 404 correctly. A sixth category later needs a redeploy — fine, values are permanent.
2. **Opposite one level down.** Leave `dynamicParams` at its default on `[slug]`, or a vendor added
   through the CMS 404s until the next deploy. Easy to get backwards.
3. **Smoke-test `/admin` and `/api`** right after adding the route. Static segments beat dynamic
   ones in Next's matcher so they should resolve, but verify rather than assume.

### Shared helper

Add `vendorHref(vendor)` and use it everywhere. `PartnersSection`, `SiteFooter`,
`SpecificationSection`, and the category index all link to vendors — hand-building the path in four
places is how one of them drifts.

### Revalidation

`src/hooks/revalidate.ts` takes a fixed `basePath`. Vendor paths now derive from `primaryCategory`,
so the hook must compute per document, and clear the **old** path when `primaryCategory` changes —
same as it already does for slug changes.

## SEO

Required before launch:

- [ ] `generateMetadata` on every route: title, description, canonical, OG.
- [ ] Carry over Webflow titles and meta descriptions on pages that rank. `/windows-doors` currently
      reads "Santa Clara Windows and Doors | Luxury Brands" — local keyword targeting, don't lose it.
- [ ] `sitemap.ts` and `robots.ts`, reading from Payload so new content self-registers.
- [ ] **Noindex or redirect `tbs-design-gallery.vercel.app`.** Production deployments on `.vercel.app`
      do *not* get the automatic noindex that previews do. It's crawlable today and will become a
      duplicate of the real site.
- [ ] Resend SPF/DKIM records added before the DNS cutover.
- [ ] Custom `not-found.tsx`.
- [ ] GA4 carry-over.
- [ ] Search Console baseline exported **before** touching anything — without it there's no way to
      prove nothing regressed.

After launch, if wanted: JSON-LD (`BlogPosting`, `HomeAndConstructionBusiness`), RSS feed.

### Images

`CLAUDE.md` establishes plain `<img>` over `next/image`. Fine for a Figma-traced page with known
dimensions; on CMS-driven templates it costs CLS and responsive `srcset`. Minimum bar: explicit
`width`/`height` on every CMS image, `fetchPriority="high"` on the hero.

## Schedule

| Dates | Phase |
| ----- | ----- |
| Aug 25–27 | **Foundations.** Schema changes, Supabase S3 verified, migrations baselined, delete the broken e2e spec (gotcha #2), GSC baseline export. |
| Aug 28–31 | **Data.** Steps 1–2 (no writes) → inspect → fix mapping → step 3 against a scratch DB → verify → re-run against production. |
| Sept 1–4 | **Templates.** Category index, vendor detail, blog index, post detail. `generateStaticParams`, `generateMetadata`, revalidate hooks. |
| Sept 5–7 | **Contact + redirects + SEO.** Resend, Zoho, spam protection. `redirects.ts`, `sitemap.ts`, `robots.ts`, vercel.app noindex. |
| Sept 8 | **QA.** Every migrated record rendered and eyeballed. Crawl staging, diff against the old sitemap, confirm zero 404s. |
| Sept 9 | **Cutover.** Add A + CNAME records in Squarespace pointing at Vercel. TTL lowered 48h prior. Webflow stays live until verified. Submit sitemap. Watch 404s for two weeks. |

Tightest point is Sept 1–4. If the Figma work for the vendor and blog templates isn't ready by
Aug 31, that's what slips.

## Before importing real data

1. **Enable Payload migrations.** Gotcha #8 — no migrations directory, and Payload pushes schema
   straight to the database. Fine against an empty DB, not fine with 30 vendors and 50 posts in
   there. Baseline the current state first.
2. **`pg_dump` before every risky operation** once real content exists.
3. **Drafts are enabled with no preview route.** Either build a small one with `draftMode()`, or
   accept that drafts are save-only and tell the editors that. Don't leave it undecided.
4. **Editor onboarding doc** for Liana and Mamuka once templates exist. One page: how to add a
   vendor, how to publish a post.

## New permanent rules

Add to the `CLAUDE.md` gotchas once this lands:

- **Category `value` strings are permanent.** Enum values and URL segments simultaneously. Change
  only the label. (Extends gotcha #5.)
- **Changing `primaryCategory` after launch breaks a live URL.** The revalidate hook clears the old
  path, but inbound links still break.
- **Vendor slugs are inherited from Webflow and carry ranking history.** Never regenerate.
