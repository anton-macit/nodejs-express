/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE todo ADD COLUMN IF NOT EXISTS priority INT NOT NULL DEFAULT 0;
`);
};

exports.down = (pgm) => {
  pgm.sql(`
        ALTER TABLE todo
            DROP COLUMN IF EXISTS priority;
    `);
};
