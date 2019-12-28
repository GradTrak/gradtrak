import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export abstract class SingleRequirement extends Requirement {
  abstract isFulfillableBy(course: Course): boolean;

  isFulfilled(courses: Course[]): boolean {
    return courses.some((course: Course) => this.isFulfillableBy(course));
  }
}
