module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(db, _client) {
    await db.dropCollection("users");
    await db.createCollection("users");
    await db
      .collection("users")
      .createIndex(
        { username: 1 },
        { unique: true, name: "unique_users_username" },
      );
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(db, _client) {
    await db.collection("users").dropIndex({ username: 1 });
  },
};
