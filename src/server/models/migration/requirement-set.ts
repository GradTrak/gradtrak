import RequirementSet from '../requirement-set';

export async function migrateRequirementSets() {
  /* undefined to v1 sets the schema version number. */
  await RequirementSet.collection.updateMany(
    { schemaVersion: { $exists: false } },
    {
      $set: { schemaVersion: 1 },
    },
  );
}
