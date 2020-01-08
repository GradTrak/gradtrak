import { Course } from 'models/course.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';
import { Tag } from 'models/tag.model';

/**
 * The TagRequirement class represents a {@link Requirement} that is fulfilled by taking a {@link Course} with a
 * specified {@link Tag}.
 */
export class TagRequirement implements StandaloneRequirement {
  id: string;
  name: string;
  tag: Tag;

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  isFulfillableBy(course: Course): boolean {
    return course.tags.includes(this.tag);
  }

  isFulfilled(courses: Course[]): boolean {
    return courses.some((course: Course) => this.isFulfillableBy(course));
  }

  getAnnotation(): string {
    return null;
  }

  toString(): string {
    return `Category: ${this.tag.name}`;
  }
}
