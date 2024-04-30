/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE todo ADD COLUMN IF NOT EXISTS "user" UUID CONSTRAINT todo_user_fk_c REFERENCES "user"(id) 
      ON UPDATE CASCADE ON DELETE CASCADE;
`);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE todo DROP COLUMN IF EXISTS "user";
`);
};
