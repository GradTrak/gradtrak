import Course from '../course';

export async function migrateCourses() {
  console.log('Beginning course schema migration');

  /* undefined to v1 sets the schema version number. */
  await Course.collection.updateMany(
    { schemaVersion: { $exists: false } },
    {
      $set: { schemaVersion: 1 },
    },
  );
}
