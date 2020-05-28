import { Constraint } from '../constraint.model';
import { Course } from '../course.model';
import { Requirement } from '../requirement.model';

/**
 * The MutexConstraint class defines a {@link Constraint} that only allows courses to be assigned to a single
 * requirement.
 */
export class MutexConstraint extends Constraint {
  /**
   * The requirements that are mutually exclusive in terms of classes.
   */
  private mutexReqs: Set<Requirement>;

  /**
   * Returns true if and only if the requirements in {@link MutexConstraint#mutexReqs} are fulfilled with unique
   * courses.
   */
  isValidMapping(mapping: Map<Requirement, Set<Course>>): boolean {
    const mutexCourses: Set<Course> = new Set<Course>();
    let valid: boolean = true;
    this.mutexReqs.forEach((req: Requirement) => {
      if (mapping.has(req)) {
        mapping.get(req).forEach((course: Course) => {
          if (mutexCourses.has(course)) {
            valid = false;
          }
          mutexCourses.add(course);
        });
      }
    });
    return valid;
  }
}
