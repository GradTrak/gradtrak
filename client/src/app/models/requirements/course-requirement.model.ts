import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class CourseRequirement extends Requirement {
  id: string;
  name: string;
  course: Course;

  isFulfilled(courses: Course[]): boolean {
    return courses.includes(this.course);
  }

  toString(): string {
    return this.course.toString();
  }
}
