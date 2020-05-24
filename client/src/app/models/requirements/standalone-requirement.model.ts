import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

/**
 * The StandaloneRequirement class represents a {@link Requirement} that can be fulfilled by a single {@link Course}, as
 * opposed to a set of courses.
 */
export abstract class StandaloneRequirement extends Requirement {
  isFulfilled(courses: Course | Course[], override?: Set<string>): boolean {
    if (courses instanceof Course) {
      return super.isFulfilled([courses], override);
    } else {
      return super.isFulfilled(courses, override);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected isFulfilledWith(courses: Course | Course[], override?: Set<string>): boolean {
    if (courses instanceof Course) {
      return this.equivIsFulfillableBy(courses, new Set<Course>());
    } else {
      return courses.some((course: Course) => {
        return this.equivIsFulfillableBy(course, new Set<Course>());
      });
    }
  }

  protected abstract isFulfillableBy(course: Course): boolean;

  /**
   * Performs a graph traversal of the graph of equivalent courses starting at the given course, returning true if any
   * equivalent course fulfills the requirement.
   */
  private equivIsFulfillableBy(course: Course, visited: Set<Course>): boolean {
    if (!visited.has(course)) {
      visited.add(course);
      if (this.isFulfillableBy(course)) {
        return true;
      } else if (course.equiv.some((equivCourse: Course) => this.equivIsFulfillableBy(equivCourse, visited))) {
        return true;
      }
    }
    return false;
  }
}
