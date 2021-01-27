import Tag from '../tag';

export async function migrateTags() {
  console.log('Beginning tag schema migration');

  /* undefined to v1 sets the schema version number. */
  await Tag.collection.updateMany(
    { schemaVersion: { $exists: false } },
    {
      $set: { schemaVersion: 1 },
    },
  );
}
