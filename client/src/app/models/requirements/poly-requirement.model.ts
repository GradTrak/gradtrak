import { Course } from 'models/course.model';
import { MultiRequirement } from 'models/requirements/multi-requirement.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';

export class PolyRequirement extends MultiRequirement implements StandaloneRequirement {
  isFulfilled(courses: Course[]): boolean {
    return courses.some((course: Course) => this.isFulfillableBy(course));
  }

  isFulfillableBy(course: Course): boolean {
    return super.isFulfilled([course]);
  }
}
