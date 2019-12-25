import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class MultiRequirement extends Requirement {
  id: string;
  name: string;

  requirements: Requirement[];
  numRequired: number;

  isFulfilled(courses: Course[]): boolean {
    return this.requirements.filter((requirement) => requirement.isFulfilled(courses)).length >= this.numRequired;
  }
}
