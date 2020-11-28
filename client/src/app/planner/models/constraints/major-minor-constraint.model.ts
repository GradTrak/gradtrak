import { ConstraintPrototype } from 'common/prototypes/constraint.prototype';
import { Course } from '../course.model';
import { FulfillmentMethodType } from '../fulfillment-type';
import { Constraint, Requirement } from '../requirement.model';
import { RequirementSet } from '../requirement-set.model';

/**
 * The MajorMinorConstraint class defines a {@link Constraint} that is 
 * used by default for all constraints between majors and minors.
 */
export class MajorMinorConstraint extends Constraint {
  /**
   * The two majors which are being doubled.
   */
  private major: RequirementSet;
  private minor: RequirementSet;

  constructor(setA: RequirementSet, setB: RequirementSet) {
    super();
    if (setA.type !== 'major' && setB.type !== 'major') {
      console.error('Attempted to construct double major constraint between non-majors');
      return null;
    }
    if (setA.type !== 'minor' && setB.type !== 'minor') {
      console.error('Attempted to construct double major constraint between non-majors');
      return null;
    }
    if (setA.type === 'major') {
      this.major = setA;
      this.minor = setB;
    } else {
      this.major = setB;
      this.minor = setA;
    }
  }

  /**
   * Returns true if and only if the two majors don't have more than 2 overlaps. 
   * Or, in the case of the engineering double major, a 5+5 rule where you need 5 
   * independent courses towards each befoe you can have a total of 5 overlap courses
   * courses.
   */
  isValidMapping(mapping: Map<Requirement, FulfillmentMethodType>): boolean {
    const mutexCourses: Set<Course> = new Set<Course>();
    const coursesA: Set<Course> = new Set();
    const coursesB: Set<Course> = new Set();
    const union: Set<Course> = new Set();
    this.minor.getRequirements().forEach((req: Requirement) => {
      if (mapping.has(req)) {
        const fulfillment: FulfillmentMethodType = mapping.get(req);
        if (fulfillment.method === 'courses') {
          fulfillment.coursesUsed.forEach((course: Course) => {
            if (parseInt(course.no.replace(/[^0-9]/, ''), 10) >= 100) {
              coursesA.add(course);
            }
          })
        }
      }
    })
    this.major.getRequirements().forEach((req: Requirement) => {
      if (mapping.has(req)) {
        const fulfillment: FulfillmentMethodType = mapping.get(req);
        if (fulfillment.method === 'courses') {
          fulfillment.coursesUsed.forEach((course: Course) => {
            if (parseInt(course.no.replace(/[^0-9]/, ''), 10) >= 100) {
              coursesB.add(course);
              if (coursesA.has(course)) {
                union.add(course);
              }
            }
          })
        }
      }
    });
    const overlapsAllowed = 1;
    return union.size > overlapsAllowed
  }
}
