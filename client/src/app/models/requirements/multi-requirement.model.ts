import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

/**
 * The MultiRequirement class represents a {@link Requirement} that contains a number of child requirements and is only
 * fulfilled if at least a specified number of those requirements are fulfilled.
 */
export class MultiRequirement implements Requirement {
  name: string;

  requirements: Requirement[];
  numRequired: number;
  hidden: boolean;

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  isFulfilled(courses: Course[]): boolean {
    return this.numFulfilled(courses) >= this.numRequired;
  }

  numFulfilled(courses: Course[]): number {
    return this.requirements.filter((requirement: Requirement) => requirement.isFulfilled(courses)).length;
  }

  getAnnotation(): string {
    if (this.hidden) {
      return this.toString();
    }
    return null;
  }

  toString(): string {
    return this.requirements.reduce(
      (annotation: string, requirement: Requirement) => `${annotation}\n${requirement.toString()}`,
      `Fulfill with ${this.numRequired} of:`,
    );
  }
}
