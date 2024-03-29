import { Course } from '../course.model';
import { Requirement } from '../requirement.model';
import { StandaloneRequirement } from './standalone-requirement.model';

import { getAllCombinations } from '../../lib/utils';

/**
 * The CountRequiremenet class represents a {@link Requirement}, has one base {@link StandaloneRequirement} and is only
 * fulfilled if a certain number of classes fulfills the the base.
 */
export class CountRequirement extends Requirement {
  numRequired: number;
  requirement: StandaloneRequirement;

  constructor(id: string, name: string, numRequired: number, requirement: StandaloneRequirement) {
    super(id, name);
    this.numRequired = numRequired;
    this.requirement = requirement;
  }

  isFulfilledWith(courses: Course[], override?: Set<string>): boolean {
    return this.countFulfilled(courses) >= this.numRequired;
  }

  /**
   * The number of courses that can fulfill the requirement
   */
  countFulfilled(courses: Course[]): number {
    return this.getFulfillingCourses(courses).length;
  }

  getFulfillingCourses(courses: Course[]): Course[] {
    // FIXME: Does not take into account constraints.
    return courses.filter((course) => this.requirement.isFulfilled(course));
  }

  getCourseCombinations(courses: Course[]): Set<Course>[] {
    const filteredCourses = courses.filter((course) => this.requirement.isFulfilledWith([course]));
    return getAllCombinations(filteredCourses).map((combination) => new Set<Course>(combination));
  }

  toString(): string {
    return `${this.numRequired} courses of \n${this.requirement.name}`;
  }
}
