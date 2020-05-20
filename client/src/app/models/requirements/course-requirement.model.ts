import { Course } from 'models/course.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';

/**
 * The CourseRequirement class represents a {@link Requirement} that is fulfilled by taking a specified {@link Course}.
 */
export class CourseRequirement extends StandaloneRequirement {
  course: Course;

  isFulfillableBy(course: Course): boolean {
    return course === this.course;
  }

  getAnnotation(): string {
    return null;
  }

  toString(): string {
    return `Course: ${this.course.getName()}`;
  }
}
