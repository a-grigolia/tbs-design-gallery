import * as migration_20260828_005656_baseline from './20260828_005656_baseline';
import * as migration_20260903_230007_posts_journal_schema from './20260903_230007_posts_journal_schema';
import * as migration_20260907_230811_contact_submissions from './20260907_230811_contact_submissions';

export const migrations = [
  {
    up: migration_20260828_005656_baseline.up,
    down: migration_20260828_005656_baseline.down,
    name: '20260828_005656_baseline',
  },
  {
    up: migration_20260903_230007_posts_journal_schema.up,
    down: migration_20260903_230007_posts_journal_schema.down,
    name: '20260903_230007_posts_journal_schema',
  },
  {
    up: migration_20260907_230811_contact_submissions.up,
    down: migration_20260907_230811_contact_submissions.down,
    name: '20260907_230811_contact_submissions'
  },
];
