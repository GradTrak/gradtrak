import { Course } from 'models/course.model';
import { SingleRequirement } from 'models/requirements/single-requirement.model';

export class CourseRequirement extends SingleRequirement {
  id: string;
  name: string;
  course: Course;

  isFulfillableBy(course: Course): boolean {
    return course === this.course;
  }

  toString(): string {
    return `Course: ${this.course.toString()}`;
  }
}
