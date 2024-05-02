/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS "user" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username varchar NOT NULL,
        hash varchar NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()        
    );
`);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS "user";
`);
};
