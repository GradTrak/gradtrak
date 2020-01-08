import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

/**
 * The StandaloneRequirement interface represents a {@link Requirement} that can be fulfilled by a single
 * {@link Course}, as opposed to a set of courses.
 */
export interface StandaloneRequirement extends Requirement {
  isFulfillableBy(course: Course): boolean;
}
