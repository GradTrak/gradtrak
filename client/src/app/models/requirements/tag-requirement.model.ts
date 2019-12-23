import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class TagRequirement implements Requirement {
  id: string;
  name: string;
  // TODO Create data type for course category tags
  tag: string;

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  isFulfilled(courses: Course[]): boolean {
    return courses.some((course) => course.tags.includes(this.tag));
  }
}
