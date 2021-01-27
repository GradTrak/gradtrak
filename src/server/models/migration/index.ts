import { migrateCourses } from './course';
import { migrateRequirementSets } from './requirement-set';
import { migrateTags } from './tag';
import { migrateUsers } from './user';

export async function migrateSchemas() {
  console.log('Beginning course schema migration');
  await migrateCourses();
  console.log('Beginning requirement set schema migration');
  await migrateRequirementSets();
  console.log('Beginning tag schema migration');
  await migrateTags();
  console.log('Beginning user schema migration');
  await migrateUsers();
  console.log('Schema migration finished');
}
