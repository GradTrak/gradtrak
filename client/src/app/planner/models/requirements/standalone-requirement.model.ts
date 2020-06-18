import { Course } from '../course.model';
import { Requirement } from '../requirement.model';

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
  isFulfilledWith(courses: Course | Course[], override?: Set<string>): boolean {
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
   * For standalones, a COURSE contributes if and only if it fullfills that standalone.
   * returns false otherwise.
   */
  canFulfill(course: Course): boolean {
    return this.isFulfillableBy(course);
  }

  /**
   * For standalones the combination of courses that will fullfill it
   * is any one course, or possibly no courses (leaving the requirement unfulfilled.)
   */
  getCourseCombinations(courses: Course[]): Set<Course>[] {
    const combinations: Set<Course>[] = courses
      .filter((course: Course) => {
        return this.isFulfilledWith([course]);
      })
      .map((course: Course) => {
        const combination: Set<Course> = new Set<Course>();
        combination.add(course);
        return combination;
      });
    combinations.push(new Set<Course>());
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
