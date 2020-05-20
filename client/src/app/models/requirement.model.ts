import { Course } from 'models/course.model';

/**
 * The Requirement class represents a single requirement that can be fulfilled by taking certain {@link Course}s and is
 * either fulfilled or unfulfilled based on the input {@link Course}s.
 */
export abstract class Requirement {
  id: string;
  name: string;

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  abstract isFulfilled(courses: Course[]): boolean;

  abstract getAnnotation(): string;

  abstract toString(): string;
}
