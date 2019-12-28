import { Course } from 'models/course.model';
import { SingleRequirement } from 'models/requirements/single-requirement.model';

export class CourseRequirement implements SingleRequirement {
  id: string;
  name: string;
  course: Course;

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  isFulfillableBy(course: Course): boolean {
    return course === this.course;
  }

  isFulfilled(courses: Course[]): boolean {
    return courses.some((course: Course) => this.isFulfillableBy(course));
  }

  getAnnotation(): string {
    return null;
  }

  toString(): string {
    return `Course: ${this.course.toString()}`;
  }
}
