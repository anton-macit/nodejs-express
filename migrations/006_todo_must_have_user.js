/* eslint-disable camelcase */

exports.shorthands = undefined;

const defaultUserName = "a093f8fdd0f641b880cc2b03e0d7ef22";
exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO "user"(username, hash) VALUES ('${defaultUserName}', '$2a$10$79at6wFPi.4j6Aq5xucOJOGVWkS27YwCqklmiXtyD2.fCnyODHG1y');
    UPDATE todo SET "user" = (SELECT id FROM "user" WHERE username = '${defaultUserName}') WHERE "user" IS NULL;
    ALTER TABLE todo ALTER COLUMN "user" SET NOT NULL;

  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE todo ALTER COLUMN "user" SET DEFAULT NULL;
    UPDATE todo SET "user" = NULL WHERE "user" = (SELECT id FROM "user" WHERE username = '${defaultUserName}');
    DELETE FROM "user" WHERE username = '${defaultUserName}'
`);
};
