/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE todo ALTER COLUMN content SET NOT NULL;
`);
};

exports.down = (pgm) => {
  pgm.sql(`
      ALTER TABLE todo
          ALTER COLUMN content DROP NOT NULL;
  `);
};
