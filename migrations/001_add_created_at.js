/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
    ALTER TABLE todo ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW();
`);
};

exports.down = (pgm) => {
    pgm.sql(`
        ALTER TABLE todo
            DROP COLUMN IF EXISTS created_at;
    `);
};
