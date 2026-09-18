# Landing Page Changes — September 15–17, 2026

A running summary of the landing-page work done across this stretch: the testimonials redesign,
the showroom section rework, and the new site-wide header/spacing/type paradigm.

## Testimonials section (`src/components/landing/TestimonialsSection.tsx`)

Rebuilt twice during this period; the current state is:

- **Desktop (1024px+)**: static three-column layout — Carey P. | Jeff C. | Efe S. + Ginny U.
  stacked — separated by hairline dividers. Columns stretch to equal height (16px vertical
  padding) so the dividers run the full row.
- **Tablet (640–1023px)**: two columns — Carey + Efe | Jeff + Ginny — same full-height divider
  treatment.
- **Mobile (below 640px)**: swipe-only Embla carousel of 320px slides with hairline dividers
  between slides (none after the last). First/last cards clamp to the edges; middle cards snap
  centered. Embla deactivates at 640px+ via its `breakpoints` option.
- **Quote format** (`content.ts`): each testimonial is a `lead` (opening sentence) + `body` +
  `author`. Leads render in Geist 20px/26px (18px/24px on mobile); bodies at 14px/20px with
  `whitespace-pre-line` for paragraph breaks.
- **Content**: four reviews — Carey P. (Google), Jeff C. (Yelp, new), Ginny U. (Google, new),
  Efe S. (Yelp). The old duplicated Efe S. entry was removed; authors use abbreviated names.
  Per-card Google/Yelp icons and star rules were dropped in favor of a single
  "★★★★★ Five stars on Google & Yelp" caption in the header.
- Along the way, an intermediate version had circular arrow buttons and arrow-driven navigation;
  both were removed with the three-column redesign. `public/landing/carousel-circle-*.svg` were
  deleted; the older `carousel-arrow-left/right.svg` remain in `public/landing/` but are now
  unreferenced.

## Showroom section (`src/components/landing/GallerySection.tsx`)

- The media column no longer has a hard width (`lg:w-[712px]` removed). The text column is fixed
  at 305px and the image card flexes (`flex-1`), so shrinking the viewport shrinks the image
  instead of squishing the text.
- Asymmetric gutters per the new image paradigm: 48px on the text side, 24px on the media side
  (`lg:pl-gutter lg:pr-[24px]`). Row vertical padding is 24px.
- Cards picked up the Figma double drop-shadow.
- **Below 1024px** the row stacks and the timed crossfade becomes a swipeable card carousel
  (320×384px cards, 12px gaps/edge gutter, dots below). Auto-advance keeps running on mobile,
  pausing while the user drags and resetting after a manual swipe or dot tap. Cards snap to the
  left edge except the last, which clamps.

## New reusable component: `CardCarousel` (`src/components/landing/Carousel.tsx`)

Mobile counterpart to the crossfade `Carousel`: Embla-driven horizontal card scroller wired to
the shared `useCarouselTimer` (5s auto-advance, IntersectionObserver pause, progress-filling
dots). Deactivates at 1024px+. Dots and timer follow Embla's real snap count (trimmed snaps can
be fewer than slides on wide viewports). Intended to be reused as other sections get the same
mobile treatment.

## Header / spacing / type paradigm (site-wide, landing scope)

- **New spacing token** `--spacing-section-top: 120px` (`pt-section-top`) in
  `src/app/(frontend)/styles.css`; section headers for Process, Partners, and Testimonials now
  open with 120px top padding (was 96px). Bottom rhythm (`pb-section`, 96px) unchanged;
  testimonials mobile uses 48px header→content gap and 72px bottom per its Figma frame.
- **Section identity headers**: the small 16px labels became real serif `<h2>`s —
  **Showroom** (GallerySection), **Products** (SpecificationSection), **Services**
  (InstallationSection).
- **Unified h2 scale**: all landing section headers ("Showroom", "Products", "Services",
  "How we work", "What our clients are saying about us", "Exceptional products, trusted
  partners") are LT Superior Serif **Medium (500)** at **30px/38px** desktop and **28px/36px**
  below 640px. Exception: "More than a showroom" keeps its own centered style
  (30px/39px → 36px/40px).
- **20px Geist standard**: 20px body-level headers are 20px/**26px** site-wide (blog excluded),
  dropping to **18px/24px** below 640px. Applied to: showroom services list (Hanken Grotesk),
  Specification category links, Installation services list, testimonial lead sentences, and
  ProcessSection desktop step titles (mobile process rows were already 18px/24px).

## Files touched

- `src/components/landing/TestimonialsSection.tsx` — rebuilt
- `src/components/landing/content.ts` — TESTIMONIALS restructured (lead/body/author)
- `src/components/landing/Carousel.tsx` — added `CardCarousel`
- `src/components/landing/GallerySection.tsx` — showroom row rework, Showroom h2
- `src/components/landing/SpecificationSection.tsx` — Products h2, link type scale
- `src/components/landing/InstallationSection.tsx` — Services h2, services list type scale
- `src/components/landing/ProcessSection.tsx` — header paradigm, step title line-height
- `src/components/landing/PartnersSection.tsx` — header paradigm
- `src/app/(frontend)/styles.css` — `--spacing-section-top` token
- `public/landing/carousel-circle-left/right.svg` — added then removed (obsolete)

## Not yet updated (intentionally out of scope)

- Vendor-page headings (`VendorCta`, `VendorAbout`) still use the old bold 36px/44px style.
- Blog components keep their own type scale (explicitly excluded from the 20px/26px standard).
- `public/landing/carousel-arrow-left/right.svg` are unreferenced and safe to delete.
