import * as migration_20260402_124250 from './20260402_124250';

export const migrations = [
  {
    up: migration_20260402_124250.up,
    down: migration_20260402_124250.down,
    name: '20260402_124250'
  },
];
