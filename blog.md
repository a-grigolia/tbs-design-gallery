# Blog

Working notes for the blog (called "journal" in some design docs — same thing).

## What exists

- **Posts collection** (`src/collections/Posts.ts`) — drafts enabled, editors create/update, admins delete. Revalidates `/blog` and `/blog/{slug}` on publish/unpublish/slug change.
- **Post detail page** (`src/app/(frontend)/blog/[slug]/page.tsx`) — from Figma 755:9110. Meta row (month + year, type, first category), serif title, excerpt, 16:9 cover, 692px body column inside the blueprint frame. ISR, 5-minute window.
- **Body renderer** (`src/components/blog/PostBody.tsx`) — styled Lexical converters: 16/24 body text (`text-ink-75`), H2 serif 24px, H3 Geist 18px medium, underlined links, inline images at natural aspect (`rounded-[12px]`), pull quotes framed by automatic hairlines.
- **SEO helper** (`postMetadata()` in `src/lib/seo.ts`) — resolves head tags with Webflow-matching fallbacks (see below).
- **Not built yet:** the `/blog` index. Nav and footer "Blog" links 404 until then.

## Data structure

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | text | yes | |
| `slug` | text, unique | yes | auto from title once, never regenerated |
| `publishedAt` | date | yes | rendered as "August 2026" |
| `type` | select: project / guide / news | yes | no default — pick every time |
| `categories` | select, many | no | same five values as Vendors; **first one shows on the index**, order matters |
| `vendors` | relationship → vendors, many | no | captured during migration, nothing renders it yet |
| `excerpt` | textarea, ≤300 chars | yes | index card text + og:description fallback |
| `coverImage` | upload → media | yes | banner + og:image fallback |
| `content` | richText (Lexical) | yes | |
| `seo.*` | group: title, description, ogTitle, ogDescription, ogImage | no | all optional overrides |

Schema lives in migration `20260903_230007_posts_journal_schema`; indexes on `publishedAt`, `type`, and the category value.

## SEO resolution

```
title            seo.title         || title
meta description seo.description   || excerpt
og:title         seo.ogTitle       || seo.title || title
og:description   seo.ogDescription || excerpt      ← deliberately skips seo.description (matches Webflow)
og:image         seo.ogImage       || coverImage
```

Twitter mirrors Open Graph, card `summary_large_image`. Migrating from Webflow: meta title → `seo.title`, meta description → `seo.description`, summary → `excerpt`; leave the OG fields empty unless a post needs a different share card.

## Authoring conventions

- **Pull quotes:** use a blockquote. The hairline rules render automatically — don't add horizontal rules around it. The line after the **last shift+enter** becomes the small attribution line ("Mamuka Grigolia, CEO").
- **Headings:** only H2 (serif 24px) and H3 (Geist 18px) are styled; stick to those.
- **Inline images:** upload nodes render full-width at natural aspect — no captions yet.
