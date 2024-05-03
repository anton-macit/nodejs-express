/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
      ALTER TABLE "user"
          ADD COLUMN username_before_007 VARCHAR DEFAULT NULL;

      UPDATE "user"
      SET username_before_007 = "user".username,
          username            = CONCAT(id, '--', "user".username)
      FROM (SELECT username
            FROM "user"
            GROUP BY username
            HAVING count(*) > 1) A
      WHERE A.username = "user".username; -- change not unique usernames

      ALTER TABLE "user"
          ADD CONSTRAINT constraint_username_unique UNIQUE (username);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
      ALTER TABLE "user"
          DROP CONSTRAINT constraint_username_unique;

      UPDATE "user"
      SET username = username_before_007
      WHERE username_before_007 IS NOT NULL;

      ALTER TABLE "user"
          DROP COLUMN username_before_007;
  `);
};
