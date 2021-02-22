import Course from '../course';

export async function migrateCourses() {
  /* undefined to v1 sets the schema version number. */
  await Course.collection.updateMany(
    { schemaVersion: { $exists: false } },
    {
      $set: { schemaVersion: 1 },
    },
  );

  /* v1 to v2 removes the berkeleytimeData._id field. */
  await Course.collection.updateMany(
    { schemaVersion: 1 },
    {
      $set: { schemaVersion: 2 },
      $unset: { 'berkeleytimeData._id': '' },
    },
  );
}
