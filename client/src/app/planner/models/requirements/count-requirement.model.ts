import { Course } from '../course.model';
import { Requirement } from '../requirement.model';
import { StandaloneRequirement } from './standalone-requirement.model';

import { getAllCombinations } from '../../../../utils';

/**
 * The CountRequiremenet class represents a {@link Requirement}, has one base {@link StandaloneRequirement} and is only
 * fulfilled if a certain number of classes fulfills the the base.
 */
export class CountRequirement extends Requirement {
  numRequired: number;
  requirement: StandaloneRequirement;
  hidden: boolean;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFulfilledWith(courses: Course[], override?: Set<string>): boolean {
    return this.countFulfilled(courses) >= this.numRequired;
  }

  /**
   * The number of courses that can fulfill the requirement
   */
  countFulfilled(courses: Course[]): number {
    return this.getFulfillingCourses(courses).length;
  }

  /**
   * Any COURSE that is a possible contribution to any child requirement is
   * a possible contribution to a UnitRequirement, and will return true.
   * @return whether the course could possibly help fullfill a requirement.
   */
  canFulfill(course: Course): boolean {
    return this.requirement.canFulfill(course);
  }

  getFulfillingCourses(courses: Course[]): Course[] {
    // FIXME: Does not take into account constraints.
    return courses.filter((course) => this.requirement.isFulfilled(course));
  }

  getCourseCombinations(courses: Course[]): Set<Course>[] {
    const filteredCourses: Course[] = courses.filter((course: Course) => this.requirement.isFulfilledWith([course]));
    return getAllCombinations(filteredCourses).map((combination: Course[]) => new Set<Course>(combination));
  }

  toString(): string {
    return `${this.numRequired} courses of \n${this.requirement.name}`;
  }
}
