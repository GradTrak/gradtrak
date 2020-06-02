import { Course } from '../course.model';
import { Requirement } from '../requirement.model';

/**
 * The MultiRequirement class represents a {@link Requirement} that contains a number of child requirements and is only
 * fulfilled if at least a specified number of those requirements are fulfilled.
 */
export class MultiRequirement extends Requirement {
  requirements: Requirement[];
  numRequired: number;
  hidden: boolean;

  isFulfilledWith(courses: Course[], override: Set<string>): boolean {
    return this.numFulfilled(courses, override) >= this.numRequired;
  }

  numFulfilled(courses: Course[], override: Set<string>): number {
    return this.requirements.filter((requirement: Requirement) => requirement.isFulfilled(courses, override)).length;
  }

  getAnnotation(): string {
    if (this.hidden) {
      return this.toString();
    }
    return null;
  }

  /**
   * For MultiRequirements, possible contribution to any of its subrequirements means it
   * contributes to the MultiRequirement.
   */
  canFulfill(course: Course): boolean {
    return this.requirements.any((requirement) => requirement.canFulfill(course));
  }

  toString(): string {
    return this.requirements.reduce(
      (annotation: string, requirement: Requirement) => `${annotation}\n${requirement.toString()}`,
      `Fulfill with ${this.numRequired} of:`,
    );
  }
}
