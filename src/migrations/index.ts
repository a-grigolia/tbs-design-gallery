import * as migration_20260828_005656_baseline from './20260828_005656_baseline';

export const migrations = [
  {
    up: migration_20260828_005656_baseline.up,
    down: migration_20260828_005656_baseline.down,
    name: '20260828_005656_baseline'
  },
];
