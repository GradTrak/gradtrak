/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course } from '../course.model';
import { Requirement } from '../requirement.model';
import { StandaloneRequirement } from './standalone-requirement.model';

/**
 * The MutexRequirement class represents a {@link Requirement} that contains a set of child
 * {@link StandaloneRequirement}s that must each be fulfilled by distinct courses. Because the status of its child
 * requirements must be determined by the surrounding MutexRequirement, each of its children can be in one of three
 * states: fulfilled, potentially fulfilled, and unfulfilled.
 */
export class MutexRequirement extends Requirement {
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

  requirements: StandaloneRequirement[];

  /**
   * Returns an array of possible arrangements to fulfill the given requirements given the set of courses.
   *
   * @param {StandaloneRequirement[]} requirements The requirements being fulfilled.
   * @param {Course[]} courses The courses that will fulfill the requirement.
   * @param {Set<string>} override The IDs of requirements that have been manually marked as fulfilled.
   * @return {Course[][]} An array of arrays of courses, each of which is one possible mapping of courses to fulfill
   * requirements by index.
   */
  private static getFulfillmentMapping(
    requirements: StandaloneRequirement[],
    courses: Course[],
    override: Set<string>,
  ): (Course | boolean)[][] {
    if (requirements.length === 0) {
      return [[]];
    }
    const firstReq: StandaloneRequirement = requirements[0];
    let fulfillingCourses: (Course | boolean)[];
    if (override && override.has(firstReq.id)) {
      fulfillingCourses = [true];
    } else {
      fulfillingCourses = [null, ...courses.filter((course: Course) => firstReq.isFulfilled(course, override))];
    }
    return fulfillingCourses.flatMap((course: Course) =>
      MutexRequirement.getFulfillmentMapping(
        requirements.slice(1),
        courses.filter((c: Course) => c !== course),
        override,
      ).map((fulfillment: Course[]) => [course, ...fulfillment]),
    );
  }

  toString(): string {
    return this.requirements.reduce(
      (annotation: string, requirement: Requirement) => `${annotation}\n${requirement.toString()}`,
      'Uniquely fulfill:',
    );
  }

  protected isFulfilledWith(courses: Course[], override?: Set<string>): boolean {
    return this.getFulfillment(courses, override).every(
      (reqFulfillment: number) => reqFulfillment === MutexRequirement.FULFILLED,
    );
  }

  /**
   * Returns an array of fulfillment status corresponding to the fulfillments of each child requirement.
   *
   * @param {Course[]} courses The input Courses that are currently being taken.
   * @param {Set<string>} override The IDs of requirements that have been manually marked as fulfilled.
   * @return {number[]} An array of fulfillment status corresponding to each child requirement.
   */
  getFulfillment(courses: Course[], override?: Set<string>): number[] {
    let mappings: (Course | boolean)[][] = MutexRequirement.getFulfillmentMapping(this.requirements, courses, override);
    const maxFulfilled: number = Math.max(
      ...mappings.map((mapping: (Course | boolean)[]) => mapping.filter((course: Course) => course).length),
    );
    mappings = mappings.filter(
      (mapping: (Course | boolean)[]) => mapping.filter((course: Course) => course).length === maxFulfilled,
    );
    return this.requirements.map((requirement: Requirement, i: number) => {
      const fulfillingWays = mappings.map((mapping: Course[]) => mapping[i]);
      if (fulfillingWays.every((course: Course | boolean) => course)) {
        return MutexRequirement.FULFILLED;
      } else if (fulfillingWays.some((course: Course | boolean) => course)) {
        return MutexRequirement.POTENTIAL;
      } else {
        return MutexRequirement.UNFULFILLED;
      }
    });
  }
}
