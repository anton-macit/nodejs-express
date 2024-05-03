/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
      CREATE TABLE backup_username_after_007 AS SELECT id, username_before_007 FROM "user" WHERE username_before_007 IS NOT NULL;

      ALTER TABLE "user"
        DROP COLUMN username_before_007;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
      ALTER TABLE "user"
        ADD COLUMN username_before_007 VARCHAR DEFAULT NULL;

      UPDATE "user"
      SET "user".username_before_007 = "backup_username_after_007".username_before_007
      FROM (SELECT id, username_before_007
            FROM backup_username_after_007) backup_username_after_007
      WHERE backup_username_after_007.id = "user".id; -- change not unique usernames

      DROP TABLE backup_username_after_007;
  `);
};
