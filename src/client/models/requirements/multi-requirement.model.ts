import { Course } from '../course.model';
import { Requirement } from '../requirement.model';
import { RequirementContainer } from '../requirement-container.model';

/**
 * The MultiRequirement class represents a {@link Requirement} that contains a number of child requirements and is only
 * fulfilled if at least a specified number of those requirements are fulfilled.
 */
export class MultiRequirement extends Requirement implements RequirementContainer {
  requirements: Requirement[];
  numRequired: number;
  hidden: boolean;

  constructor(id: string, name: string, requirements: Requirement[], numRequired: number, hidden: boolean) {
    super(id, name);
    this.requirements = requirements;
    this.numRequired = numRequired;
    this.hidden = hidden;
  }

  isFulfilledWith(courses: Course[], override?: Set<string>): boolean {
    return this.numFulfilled(courses, override) >= this.numRequired;
  }

  numFulfilled(courses: Course[], override?: Set<string>): number {
    return this.requirements.filter((requirement) => requirement.isFulfilled(courses, override)).length;
  }

  getAnnotation(): string | null {
    if (this.hidden) {
      return this.toString();
    }
    return null;
  }

  getCourseCombinations(courses: Course[]): Set<Course>[] {
    throw new Error('Tried to get Course combinations for MultiRequirement');
  }

  toString(): string {
    return this.requirements.reduce(
      (annotation, requirement) => `${annotation}\n${requirement.toString()}`,
      `Fulfill with ${this.numRequired} of:`,
    );
  }
}
