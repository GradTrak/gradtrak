import { Course } from 'models/course.model';

/**
 * The Semester class represents a single term in which a certain number of {@link Course}s can be taken.
 */
export class Semester {
  id: string;
  name: string;
  courses: Course[];

  constructor(obj: object) {
    Object.assign(this, obj);
  }
}
