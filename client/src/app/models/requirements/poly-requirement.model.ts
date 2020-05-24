import { Course } from 'models/course.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';

/**
 * The PolyRequirement class represents a {@link Requirement} that is fulfilled by a single course that fulfills a
 * specified number of its child requirements. This is used for a {@link StandaloneRequirement} that must fulfill
 * Requirement A or Requirement B or Requirement A and Requirement B.
 */
export class PolyRequirement extends StandaloneRequirement {
  requirements: StandaloneRequirement[];
  numRequired: number;
  hidden: boolean;

  numFulfilled(course: Course): number {
    return this.requirements.filter((requirement: StandaloneRequirement) => requirement.isFulfilled(course)).length;
  }

  getAnnotation(): string {
    if (this.hidden) {
      return this.toString();
    }
    return null;
  }

  toString(): string {
    return this.requirements.reduce(
      (annotation: string, requirement: StandaloneRequirement) => `${annotation}\n${requirement.toString()}`,
      `Using one course, fulfill ${this.numRequired} of:`,
    );
  }

  protected isFulfillableBy(course: Course): boolean {
    return this.numFulfilled(course) >= this.numRequired;
  }
}
