import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

/**
 * The StandaloneRequirement class represents a {@link Requirement} that can be fulfilled by a single {@link Course}, as
 * opposed to a set of courses.
 */
export abstract class StandaloneRequirement extends Requirement {
  abstract isFulfillableBy(course: Course): boolean;

  isFulfilled(courses: Course[]): boolean {
    return courses.some((course: Course) => {
      if (this.isFulfillableBy(course)) {
        return true;
      } else if (course.equiv.some((equivCourse) => this.isFulfillableBy(equivCourse))) {
        return true;
      }
      return false;
    });
  }
}
