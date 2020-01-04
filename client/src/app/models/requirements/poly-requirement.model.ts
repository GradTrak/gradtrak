import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { MultiRequirement } from 'models/requirements/multi-requirement.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';

/**
 * The PolyRequirement class represents a {@link Requirement} that is fulfilled by a single course that fulfills a
 * specified number of its child requirements. This is used for a {@link StandaloneRequirement} that must fulfill
 * Requirement A or Requirement B or Requirement A and Requirement B.
 */
export class PolyRequirement extends MultiRequirement implements StandaloneRequirement {
  isFulfilled(courses: Course[]): boolean {
    return courses.some((course: Course) => this.isFulfillableBy(course));
  }

  isFulfillableBy(course: Course): boolean {
    return super.isFulfilled([course]);
  }

  toString(): string {
    return this.requirements.reduce(
      (annotation: string, requirement: Requirement) => `${annotation}\n${requirement.toString()}`,
      `Fulfill ${this.numRequired} with one course of:`,
    );
  }
}
