import { Course } from 'models/course.model';
import { MultiRequirement } from 'models/requirements/multi-requirement.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';

export class AlternateRequirement extends MultiRequirement implements StandaloneRequirement {
  numRequired: number = 1;

  constructor(obj) {
    super({ ...obj, numRequired: 1 });
  }

  isFulfillableBy(course: Course): boolean {
    return this.isFulfilled([course]);
  }
}
