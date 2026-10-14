import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Supabase grants its Data API roles (anon/authenticated) full access to every
// table in `public`. RLS with no policies denies them everything, while Payload
// connects as the owning `postgres` role and bypasses RLS. Never FORCE it —
// that would apply RLS to the owner and lock Payload out.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE r record;
    BEGIN
      FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
      END LOOP;
    END $$;

    -- Not SECURITY DEFINER: it runs as the role that created the table, which
    -- owns it and can therefore always enable RLS on it.
    CREATE OR REPLACE FUNCTION public.rls_auto_enable()
    RETURNS event_trigger
    LANGUAGE plpgsql
    SET search_path = pg_catalog
    AS $$
    DECLARE cmd record;
    BEGIN
      FOR cmd IN
        SELECT * FROM pg_event_trigger_ddl_commands()
        WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
          AND object_type IN ('table', 'partitioned table')
          AND schema_name = 'public'
      LOOP
        BEGIN
          EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', cmd.object_identity);
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING 'rls_auto_enable: could not enable RLS on %: %', cmd.object_identity, SQLERRM;
        END;
      END LOOP;
    END $$;

    DROP EVENT TRIGGER IF EXISTS ensure_rls;
    CREATE EVENT TRIGGER ensure_rls ON ddl_command_end
      WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      EXECUTE FUNCTION public.rls_auto_enable();
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP EVENT TRIGGER IF EXISTS ensure_rls;
    DROP FUNCTION IF EXISTS public.rls_auto_enable();

    DO $$
    DECLARE r record;
    BEGIN
      FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
      END LOOP;
    END $$;
  `)
}
