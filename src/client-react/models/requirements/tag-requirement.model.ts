import { Course } from '../course.model';
import { Tag } from '../tag.model';
import { StandaloneRequirement } from './standalone-requirement.model';

/**
 * The TagRequirement class represents a {@link Requirement} that is fulfilled by taking a {@link Course} with a
 * specified {@link Tag}.
 */
export class TagRequirement extends StandaloneRequirement {
  tag: Tag;

  toString(): string {
    return `Category: ${this.tag.name}`;
  }

  protected isFulfillableBy(course: Course): boolean {
    return course.tags.includes(this.tag);
  }
}
