import { Course } from 'models/course.model';

export class Semester {
  id: string;
  name: string;
  courses: Course[];
}
