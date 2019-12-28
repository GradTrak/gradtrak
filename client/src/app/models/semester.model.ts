import { Course } from 'models/course.model';

export class Semester {
  id: string;
  name: string;
  courses: Course[];

  constructor(obj: object) {
    Object.assign(this, obj);
  }
}
