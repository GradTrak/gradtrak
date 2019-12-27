import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class MultiRequirement extends Requirement {
  id: string;
  name: string;

  requirements: Requirement[];
  numRequired: number;
  hidden: boolean;

  isFulfilled(courses: Course[]): boolean {
    return this.numFulfilled(courses) >= this.numRequired;
  }

  numFulfilled(courses: Course[]): number {
    return this.requirements.filter((requirement) => requirement.isFulfilled(courses)).length;
  }

  getAnnotation(): string {
    if (this.hidden) {
      return this.toString();
    }
    return null;
  }

  toString(): string {
    return this.requirements.reduce(
      (annotation, requirement) => `${annotation}\n${requirement.toString()}`,
      `Fulfill with ${this.numRequired} of:`,
    );
  }
}
