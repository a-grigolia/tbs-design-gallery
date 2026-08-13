# TBS Design Gallery

Backend and content model for [tbsdesigngallery.com](https://tbsdesigngallery.com), rebuilt on [Payload 3](https://payloadcms.com) + Next.js 16.

- **Database:** Postgres on Supabase (`@payloadcms/db-postgres`)
- **File storage:** Supabase Storage via its S3-compatible endpoint (`@payloadcms/storage-s3`)
- **Deployment target:** Vercel
- **Package manager:** pnpm

Only two things are edited through the CMS: **Vendors** and **Posts** (plus their **Media**). Everything else — navigation, footer, contact details, homepage, category landing pages — is hardcoded in components and edited in code, deliberately.

## Setup

1. **Install dependencies**

   ```sh
   pnpm install
   ```

2. **Create your env file**

   ```sh
   cp .env.example .env
   ```

   Then fill in every value — see [Environment variables](#environment-variables) below.

3. **Run the dev server**

   ```sh
   pnpm dev
   ```

   Open [http://localhost:3000/admin](http://localhost:3000/admin) and create the first user. Give it the `admin` role.

No migrations are needed in development — Payload pushes schema changes to the database automatically in dev mode.

### Local database without Supabase

If you want to develop against a local Postgres instead, `docker-compose up postgres` starts one matching the default `DATABASE_URI` in `.env.example`'s format (`postgresql://postgres:postgres@127.0.0.1:5432/tbs_design_gallery`).

## Environment variables

| Variable | Description |
| --- | --- |
| `DATABASE_URI` | Postgres connection string. **Must be the Supabase Session pooler (port 5432), not the Transaction pooler (6543).** Transaction mode breaks prepared statements and Drizzle fails at runtime in confusing ways. Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres` |
| `PAYLOAD_SECRET` | Long random string used by Payload to encrypt sessions and API keys. Generate with `openssl rand -hex 32`. |
| `S3_BUCKET` | Supabase Storage bucket name for media uploads. |
| `S3_REGION` | Region from Supabase Storage's S3 connection settings (e.g. `us-east-1`). |
| `S3_ENDPOINT` | S3-compatible endpoint, e.g. `https://[project-ref].supabase.co/storage/v1/s3`. |
| `S3_ACCESS_KEY_ID` | S3 access key from Supabase Storage settings. |
| `S3_SECRET_ACCESS_KEY` | S3 secret key from Supabase Storage settings. |

If `S3_BUCKET` is empty, uploads fall back to the local `media/` directory — fine for local development, never for deployed environments (Vercel's filesystem is ephemeral).

Never commit `.env` — it is gitignored.

## Content model

Four collections, nothing else:

- **Users** — Payload auth. `admin` role does everything; `editor` can create/read/update Vendors, Posts, and Media but cannot delete anything or manage users.
- **Media** — uploads. `alt` text is required. Generates `thumbnail` (400w), `card` (800w), and `hero` (1920w) WebP sizes.
- **Vendors** — draft/publish enabled. Categories are a fixed select list (no Categories collection); the option `value` strings are permanent database identifiers — change only labels after launch. Vendors live at `/vendors/[slug]`, flat.
- **Posts** — draft/publish enabled blog posts, at `/blog/[slug]`. `contentHtml` holds raw HTML imported from Webflow; new posts use the rich text `content` field.

Slugs are auto-generated from the name/title on create, stay editable, and are never regenerated on update (that would break live URLs).

Publishing, unpublishing, or deleting a Vendor or Post revalidates the relevant paths via `revalidatePath`, so content changes go live without a redeploy.

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server at `localhost:3000`. |
| `pnpm build` | Production build. |
| `pnpm start` | Serve the production build. |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after changing collections. |
| `pnpm generate:importmap` | Regenerate the admin import map. |
| `pnpm lint` | Run ESLint. |
| `pnpm test` | Run integration (Vitest) and e2e (Playwright) tests. |

## Redirects

`src/redirects.ts` exports the redirect map consumed by `next.config.ts`. It is currently empty, reserved for the Webflow URL migration map.
