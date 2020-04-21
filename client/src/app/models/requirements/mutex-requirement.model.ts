/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';

/**
 * The MutexRequirement class represents a {@link Requirement} that contains a set of child
 * {@link StandaloneRequirement}s that must each be fulfilled by distinct courses. Because the status of its child
 * requirements must be determined by the surrounding MutexRequirement, each of its children can be in one of three
 * states: fulfilled, potentially fulfilled, and unfulfilled.
 */
export class MutexRequirement implements Requirement {
  /**
   * No courses fulfill this child requirement.
   */
  static readonly UNFULFILLED = 0;

  /**
   * This requirement can be fulfilled by one of the courses, but that course could also be put towards one or more
   * other potentially fulfilled requirements.
   */
  static readonly POTENTIAL = 1;

  /**
   * This requirement is fulfilled with certainty.
   */
  static readonly FULFILLED = 2;

  id: string;
  name: string;

  requirements: StandaloneRequirement[];

  constructor(obj: object) {
    Object.assign(this, obj);
  }

  isFulfilled(courses: Course[]): boolean {
    return this.getFulfillment(courses).every(
      (reqFulfillment: { requirement: Requirement; fulfillment: number }) =>
        reqFulfillment.fulfillment === MutexRequirement.FULFILLED,
    );
  }

  /**
   * Returns an array of objects containing each sub-Requirement and its current fulfillment status based on the given
   * Courses.
   *
   * @param {Course[]} courses The input Courses that are currently being taken.
   * @return {} An array of objects each containing a Requirement and a fulfillment status.
   */
  getFulfillment(courses: Course[]): { requirement: Requirement; fulfillment: number }[] {
    let mappings: Course[][] = MutexRequirement.getFulfillmentMapping(this.requirements, courses);
    const maxFulfilled: number = Math.max(
      ...mappings.map((mapping: Course[]) => mapping.filter((course: Course) => course).length),
    );
    mappings = mappings.filter(
      (mapping: Course[]) => mapping.filter((course: Course) => course).length === maxFulfilled,
    );
    return this.requirements.map((requirement: Requirement, i: number) => {
      const fulfillingWays = mappings.map((mapping: Course[]) => mapping[i]);
      if (fulfillingWays.every((course: Course) => course)) {
        return { requirement: requirement, fulfillment: MutexRequirement.FULFILLED };
      } else if (fulfillingWays.some((course: Course) => course)) {
        return { requirement: requirement, fulfillment: MutexRequirement.POTENTIAL };
      } else {
        return { requirement: requirement, fulfillment: MutexRequirement.UNFULFILLED };
      }
    });
  }

  /**
   * Returns an array of possible arrangements to fulfill the given requirements given the set of courses.
   *
   * @param {Course[]} courses The courses that will fulfill the requirement.
   * @return {Course[][]} An array of arrays of courses, each of which is one possible mapping of courses to fulfill
   * requirements by index.
   */
  private static getFulfillmentMapping(requirements: StandaloneRequirement[], courses: Course[]): Course[][] {
    if (requirements.length == 0) {
      return [[]];
    }
    const firstReq: StandaloneRequirement = requirements[0];
    let fulfillingCourses: Course[] = [null, ...courses.filter((course: Course) => firstReq.isFulfillableBy(course))];
    return fulfillingCourses.flatMap((course: Course) =>
      MutexRequirement.getFulfillmentMapping(
        requirements.slice(1),
        courses.filter((c: Course) => c !== course),
      ).map((fulfillment: Course[]) => [course, ...fulfillment]),
    );
  }

  getAnnotation(): string {
    return null;
  }

  toString(): string {
    return this.requirements.reduce(
      (annotation: string, requirement: Requirement) => `${annotation}\n${requirement.toString()}`,
      'Uniquely fulfill:',
    );
  }
}
