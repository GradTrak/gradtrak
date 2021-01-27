import RequirementSet from '../requirement-set';

export async function migrateRequirementSets() {
  console.log('Beginning requirement set schema migration');

  /* undefined to v1 sets the schema version number. */
  await RequirementSet.collection.updateMany(
    { schemaVersion: { $exists: false } },
    {
      $set: { schemaVersion: 1 },
    },
  );
}
