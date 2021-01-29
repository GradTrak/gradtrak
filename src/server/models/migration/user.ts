import User from '../user';

// prettier-ignore
export async function migrateUsers() {
  /* undefined to v1 sets the schema version number. */
  await User.collection.updateMany(
    { schemaVersion: { $exists: false } },
    {
      $set: { schemaVersion: 1 },
    },
  );

  /* v1 to v2 moves pushes a single user data object to become value associated
   * with 'Schedule 1' in the map of user data objects. It also capitalizes the
   * userdata field to userData. */
  await User.collection.updateMany(
    { schemaVersion: 1 },
    [
      {
        $addFields: {
          'userData.schedules.Schedule 1': '$userdata',
        },
      },
      {
        $project: {
          userdata: 0,
        },
      },
      {
        $addFields: {
          schemaVersion: 2,
        },
      },
    ],
  );
}
