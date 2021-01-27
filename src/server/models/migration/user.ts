import User from '../user';

export async function migrateUsers() {
  /* undefined to v1 sets the schema version number. */
  await User.collection.updateMany(
    { schemaVersion: { $exists: false } },
    {
      $set: { schemaVersion: 1 },
    },
  );
}
