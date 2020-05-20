import { Course } from 'models/course.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';

/**
 * The CourseRequirement class represents a {@link Requirement} that is fulfilled by taking a specified {@link Course}.
 */
export class CourseRequirement implements StandaloneRequirement {
  name: string;
  course: Course;

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  isFulfillableBy(course: Course): boolean {
    if (course === this.course) {
      return true;
    } else {
      return course.equiv.some((course: Course) => this.isFulfillableBy(course));
    }
  }

  isFulfilled(courses: Course[]): boolean {
    return courses.some((course: Course) => this.isFulfillableBy(course));
  }

  getAnnotation(): string {
    return null;
  }

  toString(): string {
    return `Course: ${this.course.getName()}`;
  }
}
