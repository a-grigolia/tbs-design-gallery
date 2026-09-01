import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Vendors } from './collections/Vendors'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Vendors, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Supabase's session pooler allows 15 clients total. Next dev runs
      // generateStaticParams in a separate worker process with its own pool
      // (pg defaults to 10 per process), so uncapped pools exhaust the limit.
      max: 4,
    },
    // Dev-mode drizzle push re-introspects the schema on every process init
    // (dev server, static-params worker, scripts), holding pooler clients and
    // hanging on interactive prompts in non-TTY contexts. Schema changes are
    // applied deliberately instead — see src/migrations.
    push: false,
  }),
  sharp,
  plugins: [
    s3Storage({
      // Falls back to local disk storage when S3_BUCKET is unset (local dev
      // without Supabase). Always set the S3_* vars in deployed environments.
      enabled: Boolean(process.env.S3_BUCKET),
      collections: {
        media: {
          // Media is public-read, so skip Payload's /api/media/file proxy and
          // point URLs straight at the public bucket (Supabase CDN). The proxy
          // needs a DB connection per image, which exhausts Supabase's
          // 15-client session pooler under parallel image loads on Vercel.
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            // S3_ENDPOINT is the S3 API (…/storage/v1/s3); public objects live
            // at …/storage/v1/object/public/{bucket}/{key}.
            const base = (process.env.S3_ENDPOINT ?? '').replace(/\/s3$/, '')
            return [`${base}/object/public/${process.env.S3_BUCKET}`, prefix, filename]
              .filter(Boolean)
              .join('/')
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT || '',
        region: process.env.S3_REGION || '',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        // Required for Supabase Storage's S3-compatible endpoint.
        forcePathStyle: true,
      },
    }),
  ],
})
