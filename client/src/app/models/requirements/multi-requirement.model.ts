import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class MultiRequirement extends Requirement {
  id: string;
  name: string;

  requirements: Requirement[];
  numRequired: number;
  hidden: boolean;

  isFulfilled(courses: Course[]): boolean {
    return this.requirements.filter((requirement) => requirement.isFulfilled(courses)).length >= this.numRequired;
  }

  getAnnotation(): string {
    if (this.hidden) {
      return this.requirements
        .reduce((annotation, requirement) => `${annotation}\n${requirement.toString()}`, 'Fulfill with:\n')
        .trim();
    }
    return null;
  }
}
