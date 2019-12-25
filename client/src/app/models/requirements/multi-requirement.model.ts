import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class MultiRequirement implements Requirement {
  id: string;
  name: string;

  requirements: Requirement[];
  numRequired: number;

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  isFulfilled(courses: Course[]): boolean {
    return this.requirements.filter((requirement) => requirement.isFulfilled(courses)).length >= this.numRequired;
  }
}
