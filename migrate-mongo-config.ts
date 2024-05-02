require("dotenv/config");

module.exports = {
  mongodb: {
    url: process.env.MONGODB_CONNECTION_STRING,
  },

  migrationsDir: "migrations",

  changelogCollectionName: "changelog",

  migrationFileExtension: ".js",

  useFileHash: false,

  // Don't change this, unless you know what you're doing
  moduleSystem: "commonjs",
};
