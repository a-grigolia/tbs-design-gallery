import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Posts journal schema: adds type, categories, vendors relationship, and the
 * OG half of the seo group; drops the Webflow-era content_html and author
 * columns. The old flat seo_title/seo_description columns are reused verbatim
 * by the new `seo` group (same generated column names), so they don't appear.
 *
 * The generator also emitted vendor DDL (vendors_rels, heading, location, …)
 * because the baseline snapshot predates the vendor gallery/rels change that
 * was applied to the live database via dev push. Those statements were removed
 * by hand — the snapshot JSON alongside this migration now captures the full
 * current schema, so future diffs are clean.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_categories" AS ENUM('custom-cabinetry', 'windows-doors', 'outdoor-living', 'appliances', 'architectural-elements-furniture');
  CREATE TYPE "public"."enum_posts_type" AS ENUM('project', 'guide', 'news');
  CREATE TYPE "public"."enum__posts_v_version_categories" AS ENUM('custom-cabinetry', 'windows-doors', 'outdoor-living', 'appliances', 'architectural-elements-furniture');
  CREATE TYPE "public"."enum__posts_v_version_type" AS ENUM('project', 'guide', 'news');
  CREATE TABLE "posts_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_posts_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"vendors_id" integer
  );
  
  CREATE TABLE "_posts_v_version_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__posts_v_version_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"vendors_id" integer
  );
  
  ALTER TABLE "posts" ADD COLUMN "type" "enum_posts_type";
  ALTER TABLE "posts" ADD COLUMN "seo_og_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "seo_og_description" varchar;
  ALTER TABLE "posts" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_type" "enum__posts_v_version_type";
  ALTER TABLE "_posts_v" ADD COLUMN "version_seo_og_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_seo_og_description" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "posts_categories" ADD CONSTRAINT "posts_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_categories" ADD CONSTRAINT "_posts_v_version_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_categories_order_idx" ON "posts_categories" USING btree ("order");
  CREATE INDEX "posts_categories_parent_idx" ON "posts_categories" USING btree ("parent_id");
  CREATE INDEX "posts_categories_value_idx" ON "posts_categories" USING btree ("value");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_vendors_id_idx" ON "posts_rels" USING btree ("vendors_id");
  CREATE INDEX "_posts_v_version_categories_order_idx" ON "_posts_v_version_categories" USING btree ("order");
  CREATE INDEX "_posts_v_version_categories_parent_idx" ON "_posts_v_version_categories" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_categories_value_idx" ON "_posts_v_version_categories" USING btree ("value");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_vendors_id_idx" ON "_posts_v_rels" USING btree ("vendors_id");
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_type_idx" ON "posts" USING btree ("type");
  CREATE INDEX "posts_seo_seo_og_image_idx" ON "posts" USING btree ("seo_og_image_id");
  CREATE INDEX "_posts_v_version_version_type_idx" ON "_posts_v" USING btree ("version_type");
  CREATE INDEX "_posts_v_version_seo_version_seo_og_image_idx" ON "_posts_v" USING btree ("version_seo_og_image_id");
  ALTER TABLE "posts" DROP COLUMN "content_html";
  ALTER TABLE "posts" DROP COLUMN "author";
  ALTER TABLE "_posts_v" DROP COLUMN "version_content_html";
  ALTER TABLE "_posts_v" DROP COLUMN "version_author";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_categories" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_categories" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  ALTER TABLE "posts" DROP CONSTRAINT "posts_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_seo_og_image_id_media_id_fk";
  
  DROP INDEX "posts_type_idx";
  DROP INDEX "posts_seo_seo_og_image_idx";
  DROP INDEX "_posts_v_version_version_type_idx";
  DROP INDEX "_posts_v_version_seo_version_seo_og_image_idx";
  ALTER TABLE "posts" ADD COLUMN "content_html" varchar;
  ALTER TABLE "posts" ADD COLUMN "author" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content_html" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_author" varchar;
  ALTER TABLE "posts" DROP COLUMN "type";
  ALTER TABLE "posts" DROP COLUMN "seo_og_title";
  ALTER TABLE "posts" DROP COLUMN "seo_og_description";
  ALTER TABLE "posts" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_type";
  ALTER TABLE "_posts_v" DROP COLUMN "version_seo_og_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_seo_og_description";
  ALTER TABLE "_posts_v" DROP COLUMN "version_seo_og_image_id";
  DROP TYPE "public"."enum_posts_categories";
  DROP TYPE "public"."enum_posts_type";
  DROP TYPE "public"."enum__posts_v_version_categories";
  DROP TYPE "public"."enum__posts_v_version_type";`)
}
