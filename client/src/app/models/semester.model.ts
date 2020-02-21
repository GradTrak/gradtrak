import { SemesterPrototype } from 'common/prototypes/semester.prototype';
import { Course } from 'models/course.model';

/**
 * The Semester class represents a single term in which a certain number of {@link Course}s can be taken.
 */
export class Semester {
  id: string;
  name: string;
  courses: Course[];

  constructor(name: string);
  constructor(proto: SemesterPrototype, coursesMap: Map<string, Course>);

  constructor(obj: string | SemesterPrototype, coursesMap?: Map<string, Course>) {
    switch (typeof obj) {
      case 'object': {
        const proto: SemesterPrototype = obj as SemesterPrototype;
        this.id = proto.id;
        this.name = proto.name;
        this.courses = proto.courseIds.map((courseId: string) => coursesMap.get(courseId));
        break;
      }

      case 'string': {
        const name: string = obj as string;
        this.id = name.toLowerCase().replace(/[^\w]/g, '');
        this.name = name;
        this.courses = [];
        break;
      }

      default: {
        throw new Error('Semester constructor can only take string or object');
      }
    }
  }
}
