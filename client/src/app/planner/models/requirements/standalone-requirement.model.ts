import { Course } from '../course.model';
import { Requirement } from '../requirement.model';

/**
 * The StandaloneRequirement class represents a {@link Requirement} that can be fulfilled by a single {@link Course}, as
 * opposed to a set of courses.
 */
export abstract class StandaloneRequirement extends Requirement {
  abstract isFulfillableBy(course: Course): boolean;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFulfilledWith(courses: Course[], override: Set<string>): boolean {
    return courses.some((course: Course) => {
      return this.equivIsFulfillableBy(course, new Set<Course>());
    });
  }

  /**
   * For standalones, a COURSE contributes if and only if it fullfills that standalone.
   * returns false otherwise.
   */
  canFulfill(course: Course): boolean {
    return this.isFulfillableBy(course);
  }

  getCourseCombinations(courses: Course[]): Course[][] {
    const combinations: Course[][] = courses.filter((course: Course) => {
      return this.isFulfilledWith([course], null);
    }).map((course: Course) => {
      return [course];
    });
    combinations.push([]);
    return combinations;
  }

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
