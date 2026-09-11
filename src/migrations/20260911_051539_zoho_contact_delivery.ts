import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_zoho_status" AS ENUM('pending', 'delivered', 'failed');
  ALTER TABLE "contact_submissions" ADD COLUMN "street" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "city" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "state" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "zipcode" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "google_place_id" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "zoho_status" "enum_contact_submissions_zoho_status" DEFAULT 'pending' NOT NULL;
  ALTER TABLE "contact_submissions" ADD COLUMN "zoho_attempts" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "contact_submissions" ADD COLUMN "zoho_last_attempt_at" timestamp(3) with time zone;
  ALTER TABLE "contact_submissions" ADD COLUMN "zoho_last_error" varchar;

  UPDATE "contact_submissions"
  SET
    "street" = CASE
      WHEN array_length(string_to_array("address", ','), 1) >= 3
        THEN COALESCE(NULLIF(btrim(split_part("address", ',', 1)), ''), 'Unknown')
      ELSE 'Unknown'
    END,
    "city" = CASE
      WHEN array_length(string_to_array("address", ','), 1) >= 3
        THEN COALESCE(NULLIF(btrim(split_part("address", ',', 2)), ''), 'Unknown')
      ELSE COALESCE(NULLIF(btrim(split_part("address", ',', 1)), ''), 'Unknown')
    END,
    "state" = 'CA',
    "zipcode" = CASE
      WHEN array_length(string_to_array("address", ','), 1) >= 3
        THEN COALESCE(
          NULLIF(
            btrim(
              regexp_replace(
                btrim(split_part("address", ',', 3)),
                '^[A-Za-z]{2}[[:space:]]+',
                ''
              )
            ),
            ''
          ),
          'Unknown'
        )
      ELSE COALESCE(NULLIF(btrim(split_part("address", ',', 2)), ''), 'Unknown')
    END,
    "google_place_id" = '';

  ALTER TABLE "contact_submissions" ALTER COLUMN "street" SET NOT NULL;
  ALTER TABLE "contact_submissions" ALTER COLUMN "city" SET NOT NULL;
  ALTER TABLE "contact_submissions" ALTER COLUMN "state" SET NOT NULL;
  ALTER TABLE "contact_submissions" ALTER COLUMN "zipcode" SET NOT NULL;
  ALTER TABLE "contact_submissions" ALTER COLUMN "google_place_id" SET NOT NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" DROP COLUMN "street";
  ALTER TABLE "contact_submissions" DROP COLUMN "city";
  ALTER TABLE "contact_submissions" DROP COLUMN "state";
  ALTER TABLE "contact_submissions" DROP COLUMN "zipcode";
  ALTER TABLE "contact_submissions" DROP COLUMN "google_place_id";
  ALTER TABLE "contact_submissions" DROP COLUMN "zoho_status";
  ALTER TABLE "contact_submissions" DROP COLUMN "zoho_attempts";
  ALTER TABLE "contact_submissions" DROP COLUMN "zoho_last_attempt_at";
  ALTER TABLE "contact_submissions" DROP COLUMN "zoho_last_error";
  DROP TYPE "public"."enum_contact_submissions_zoho_status";`)
}
