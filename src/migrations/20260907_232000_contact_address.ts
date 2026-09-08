import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contact_submissions" ADD COLUMN "address" varchar;
    UPDATE "contact_submissions"
      SET "address" = concat_ws(', ', NULLIF("city", ''), NULLIF("zipcode", ''));
    ALTER TABLE "contact_submissions" ALTER COLUMN "address" SET NOT NULL;
    ALTER TABLE "contact_submissions" DROP COLUMN "city";
    ALTER TABLE "contact_submissions" DROP COLUMN "zipcode";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contact_submissions" ADD COLUMN "city" varchar;
    ALTER TABLE "contact_submissions" ADD COLUMN "zipcode" varchar;
    UPDATE "contact_submissions" SET "city" = "address", "zipcode" = '';
    ALTER TABLE "contact_submissions" ALTER COLUMN "city" SET NOT NULL;
    ALTER TABLE "contact_submissions" ALTER COLUMN "zipcode" SET NOT NULL;
    ALTER TABLE "contact_submissions" DROP COLUMN "address";
  `)
}
