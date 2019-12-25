import { Course } from 'models/course.model';

export abstract class Requirement {
  id: string;
  name: string;

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  abstract isFulfilled(courses: Course[]): boolean;
}
