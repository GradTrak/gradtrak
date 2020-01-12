import { Course } from 'models/course.model';

/**
 * The Semester class represents a single term in which a certain number of {@link Course}s can be taken.
 */
export class Semester {
  id: string;
  name: string;
  courses: Course[];

  constructor(name: string);
  constructor(obj: object);

  constructor(obj: unknown) {
    switch (typeof obj) {
      case 'object':
        Object.assign(this, obj);
        break;

      case 'string':
        this.id = obj.toLowerCase().replace(/[^\w]/g, '');
        this.name = obj;
        this.courses = [];
        break;

      default:
        throw new Error('Semester constructor can only take string or object');
    }
  }
}
