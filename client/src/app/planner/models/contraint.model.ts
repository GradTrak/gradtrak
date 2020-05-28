import { ConstraintPrototype } from 'common/prototypes/constraint.prototype';
import { Course } from './course.model';
import { Requirement } from './requirement.model';

/**
 * The Constraint class describes a restriction placed upon ways that {@link Course}s can be assigned to
 * {@link Requirement}s.
 */
export abstract class Constraint {
  /**
   * Constructs a new Constraint from its prototype.
   *
   * @param {ConstraintPrototype} proto The prototype.
   */
  constructor(proto: ConstraintPrototype) {
    Object.assign(this, proto);
  }

  /**
   * Returns whether the given mapping of requirements to courses is valid.
   *
   * @param {Map<Requirement, Set<Course>>} mapping The mapping of requirement to courses.
   * @return {boolean} Whether the mapping is valid.
   */
  abstract isValidMapping(mapping: Map<Requirement, Set<Course>>): boolean;
}
