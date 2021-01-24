import { Course } from './course.model';
import { FulfillmentMethodType } from './fulfillment-type';

/**
 * The Requirement class represents a single requirement that can be fulfilled by taking certain {@link Course}s and is
 * either fulfilled or unfulfilled based on the input {@link Course}s.
 */
export abstract class Requirement {
  id: string;
  name: string;
  private _constraints?: Constraint[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  /* Requirement.fromProto is currently RequirementCategory.reqFromProto to
   * avoid circular dependencies. */

  isFulfilled(courses: Course[], override?: Set<string>): boolean {
    if (override?.has(this.id)) {
      return true;
    }
    return this.isFulfilledWith(courses, override);
  }

  abstract isFulfilledWith(courses: Course[], override?: Set<string>): boolean;

  getAnnotation(): string | null {
    return null;
  }

  abstract toString(): string;

  get constraints(): Constraint[] {
    if (!this._constraints) {
      throw new Error('Tried to get requirement constraints before initialized');
    }
    return this._constraints;
  }

  set constraints(constraints: Constraint[]) {
    if (this._constraints) {
      throw new Error('Tried to double-initialize constraints');
    }
    this._constraints = constraints;
  }

  /**
   * Given a list of COURSES, returns a 2d array. Each element in the 2d array
   * is an array of courses which potentially fullfill part or all of the requirement.
   */
  abstract getCourseCombinations(courses: Course[]): Set<Course>[];
}

/**
 * The Constraint class describes a restriction placed upon ways that
 * {@link Course}s can be assigned to {@link Requirement}s.
 */
export abstract class Constraint {
  /**
   * Returns whether the given mapping of requirements to courses is valid.
   *
   * @param {Map<Requirement, Set<Course> | boolean>} mapping The mapping of
   * requirement to courses or a boolean indicating manual fulfillment.
   * @return {boolean} Whether the mapping is valid.
   */
  abstract isValidMapping(mapping: Map<Requirement, FulfillmentMethodType>): boolean;
}
