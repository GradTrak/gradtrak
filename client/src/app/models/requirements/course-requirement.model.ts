import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class CourseRequirement implements Requirement {
  id: string;
  name: string;
  course: Course;

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  isFulfilled(courses: Course[]): boolean {
    return courses.includes(this.course);
  }
}
