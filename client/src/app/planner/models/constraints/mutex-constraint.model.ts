import { Constraint } from '../constraint.model';
import { Course } from '../course.model';
import { Requirement } from '../requirement.model';

/**
 * The MutexConstraint class defines a {@link Constraint} that only allows courses to be assigned to a single
 * requirement.
 */
export class MutexConstraint extends Constraint {
  /**
   * The requirements that are mutually exclusive in terms of classes.
   */
  private manuallyFulfilledReqs: Set<Requirement>;

  isValidMapping(mapping: Map<Requirement, Set<Course>>): boolean {
    return true; // FIXME Actually implement this
  }
}
