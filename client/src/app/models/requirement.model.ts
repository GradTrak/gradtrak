import { Course } from 'models/course.model';

/**
 * The Requirement interface represents a single requirement that can be fulfilled by taking certain {@link Course}s
 * and is either fulfilled or unfulfilled based on the input {@link Course}s.
 */
export interface Requirement {
  id: string;

  name: string;

  isFulfilled(courses: Course[]): boolean;

  getAnnotation(): string;

  toString(): string;
}
