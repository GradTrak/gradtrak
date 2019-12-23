import { Course } from 'models/course.model';

export interface Requirement {
  id: string;
  name: string;

  isFulfilled(courses: Course[]): boolean;
}
