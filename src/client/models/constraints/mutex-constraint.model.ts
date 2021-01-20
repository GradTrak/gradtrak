import { ConstraintPrototype } from '../../../common/prototypes/constraint.prototype';
import { Course } from '../course.model';
import { FulfillmentMethodType } from '../fulfillment-type';
import { Constraint, Requirement } from '../requirement.model';

/**
 * The MutexConstraint class defines a {@link Constraint} that only allows courses to be assigned to a single
 * requirement.
 */
export class MutexConstraint extends Constraint {
  /**
   * The requirements that are mutually exclusive in terms of classes.
   */
  private mutexReqs: Set<Requirement>;

  constructor(mutexReqs: Set<Requirement>) {
    super();
    this.mutexReqs = mutexReqs;
  }

  /**
   * Constructs a MutexConstraint from a ConstraintPrototype and its
   * requirement set's mapping of IDs to requirements.
   *
   * @param {ConstraintPrototype} proto The prototype.
   * @param {Map<string, Requirement>} reqMap The map of requirement IDs to
   * requirements for the requirement set the constraint belongs to.
   * @return {MutexConstraint} The constructed constraint.
   */
  static fromProto(proto: ConstraintPrototype, reqMap: Map<string, Requirement>): MutexConstraint {
    return new MutexConstraint(new Set<Requirement>(proto.mutexReqIds.map((reqId) => reqMap.get(reqId))));
  }

  /**
   * Returns true if and only if the requirements in {@link MutexConstraint#mutexReqs} are fulfilled with unique
   * courses.
   */
  isValidMapping(mapping: Map<Requirement, FulfillmentMethodType>): boolean {
    const mutexCourses = new Set<Course>();
    let valid = true;
    this.mutexReqs.forEach((req) => {
      if (mapping.has(req)) {
        const fulfillment = mapping.get(req);
        if (fulfillment.method === 'courses') {
          fulfillment.coursesUsed.forEach((course) => {
            if (mutexCourses.has(course)) {
              valid = false;
            }
            mutexCourses.add(course);
          });
        }
      }
    });
    return valid;
  }
}
