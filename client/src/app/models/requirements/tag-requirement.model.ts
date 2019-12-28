import { Course } from 'models/course.model';
import { SingleRequirement } from 'models/requirements/single-requirement.model';
import { Tag } from 'models/tag.model';

export class TagRequirement extends SingleRequirement {
  id: string;
  name: string;
  tag: Tag;

  isFulfillableBy(course: Course): boolean {
    return course.tags.includes(this.tag);
  }

  toString(): string {
    return `Category: ${this.tag.name}`;
  }
}
