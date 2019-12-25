import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class TagRequirement extends Requirement {
  id: string;
  name: string;
  // TODO Create data type for course category tags
  tag: string;

  isFulfilled(courses: Course[]): boolean {
    return courses.some((course) => course.tags.includes(this.tag));
  }

  toString(): string {
    return `Category: ${this.tag}`;
  }
}
