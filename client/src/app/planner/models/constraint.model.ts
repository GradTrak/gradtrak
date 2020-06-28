import { Course } from './course.model';
import { Requirement } from './requirement.model';

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
  abstract isValidMapping(mapping: Map<Requirement, Set<Course> | boolean>): boolean;
}
