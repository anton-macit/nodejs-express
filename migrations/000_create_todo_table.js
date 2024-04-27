/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS todo (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT
    );
`);
};

exports.down = (pgm) => {
    pgm.sql(`
    DROP TABLE IF EXISTS todo;

    DROP EXTENSION IF EXISTS pgcrypto;
`);
};
