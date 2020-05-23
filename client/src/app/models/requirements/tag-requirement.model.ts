import { Course } from 'models/course.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';
import { Tag } from 'models/tag.model';

/**
 * The TagRequirement class represents a {@link Requirement} that is fulfilled by taking a {@link Course} with a
 * specified {@link Tag}.
 */
export class TagRequirement extends StandaloneRequirement {
  tag: Tag;

  isFulfillableBy(course: Course): boolean {
    return course.tags.includes(this.tag);
  }

  toString(): string {
    return `Category: ${this.tag.name}`;
  }
}
