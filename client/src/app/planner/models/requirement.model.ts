import { Course } from './course.model';
import { Constraint } from './constraint.model';

/**
 * The Requirement class represents a single requirement that can be fulfilled by taking certain {@link Course}s and is
 * either fulfilled or unfulfilled based on the input {@link Course}s.
 */
export abstract class Requirement {
  id: string;
  name: string;
  universalConstraints: Constraint[];
  selfConstraints: Constraint[];

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  isFulfilled(courses: Course[], override: Set<string>): boolean {
    if (override && override.has(this.id)) {
      return true;
    }
    return this.isFulfilledWith(courses, override);
  }

  abstract isFulfilledWith(courses: Course[], override: Set<string>): boolean;

  getAnnotation(): string {
    return null;
  }

  abstract toString(): string;
}
