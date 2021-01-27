import { migrateCourses } from './course';
import { migrateRequirementSets } from './requirement-set';
import { migrateTags } from './tag';
import { migrateUsers } from './user';

export async function migrateSchemas() {
  await migrateCourses();
  await migrateRequirementSets();
  await migrateTags();
  await migrateUsers();
}
