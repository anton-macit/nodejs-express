/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
      CREATE TABLE username_after_008 AS SELECT id, username_before_007 FROM "user" WHERE username_before_007 IS NOT NULL;

      ALTER TABLE "user"
        DROP COLUMN username_before_007;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
      ALTER TABLE "user"
        ADD COLUMN username_before_007 VARCHAR DEFAULT NULL;

      UPDATE "user"
      SET "user".username_before_007 = "username_after_008".username_before_007
      FROM (SELECT id, username_before_007
            FROM username_after_008) username_after_008
      WHERE username_after_008.id = "user".id; -- change not unique usernames

      DROP TABLE username_after_008;
  `);
};
