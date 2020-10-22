import { Course } from '../course.model';
import { StandaloneRequirement } from './standalone-requirement.model';

/**
 * The CourseRequirement class represents a {@link Requirement} that is fulfilled by taking a specified {@link Course}.
 */
export class RegexRequirement extends StandaloneRequirement {
  deptRegex: RegExp;
  numberRegex: RegExp;

  protected isFulfillableBy(course: Course): boolean {
    return this.deptRegex.test(course.dept) && this.numberRegex.test(course.no);
  }

  isFulfilledWith(courses: Course[], override?: Set<string>): boolean {
    return courses.some((course: Course[]) => {
      return this.isFulfillableBy(course);
    });
  }

  toString(): string {
    return this.name;
  }

  canFulfill(course: Course): boolean {
    return this.isFulfillableBy(course);
  }
}
