import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { Tag } from 'models/tag.model';

export class TagRequirement extends Requirement {
  id: string;
  name: string;
  tag: Tag;

  isFulfilled(courses: Course[]): boolean {
    return courses.some((course) => course.tags.includes(this.tag));
  }

  toString(): string {
    return `Category: ${this.tag.name}`;
  }
}
