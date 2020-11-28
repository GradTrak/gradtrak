import { ConstraintPrototype } from 'common/prototypes/constraint.prototype';
import { Course } from '../course.model';
import { FulfillmentMethodType } from '../fulfillment-type';
import { Constraint, Requirement } from '../requirement.model';
import { RequirementSet } from '../requirement-set.model';

/**
 * The DoubleMajorConstraint class defines a {@link Constraint} that is 
 * used for a double major or double degree in most colleges, with the 
 * exception of engineering.
 */
export class DoubleMajorConstraint extends Constraint {
  /**
   * The two majors which are being doubled.
   */
  private majorA: RequirementSet;
  private majorB: RequirementSet;

  constructor(majorA: RequirementSet, majorB: RequirementSet) {
    super();
    if (majorA.type !== 'major' || majorB.type !== 'major') {
      console.error('Attempted to construct double major constraint between non-majors');
      return null;
    }
    this.majorA = majorA;
    this.majorB = majorB;
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
    this.majorA.getRequirements().forEach((req: Requirement) => {
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
    this.majorB.getRequirements().forEach((req: Requirement) => {
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
    if (this.majorA.parent.id === 'coe' && this.majorB.parent.id === 'coe') {
      if (union.size === 0) {
        return true;
      }
      // courses that are not overlapping
      const noOverlapA = coursesA.size - union.size;
      const noOverlapB = coursesB.size - union.size;
      if (union.size <= 5 && noOverlapA && noOverlapB) {
        return true;
      }
      return false;
    }
    const overlapsAllowed = 2;
    return union.size > overlapsAllowed
  }
}
