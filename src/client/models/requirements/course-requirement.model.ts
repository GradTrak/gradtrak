import { Course } from '../course.model';
import { StandaloneRequirement } from './standalone-requirement.model';

/**
 * The CourseRequirement class represents a {@link Requirement} that is fulfilled by taking a specified {@link Course}.
 */
export class CourseRequirement extends StandaloneRequirement {
  course: Course;

  constructor(id: string, name: string, course: Course) {
    super(id, name);
    this.course = course;
  }

  protected isFulfillableBy(course: Course): boolean {
    return course === this.course;
  }

  toString(): string {
    return `Course: ${this.course.getName()}`;
  }
}
