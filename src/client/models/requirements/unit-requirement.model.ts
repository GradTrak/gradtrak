import { Course } from '../course.model';
import { Requirement } from '../requirement.model';
import { StandaloneRequirement } from './standalone-requirement.model';

import { getAllCombinations } from '../../lib/utils';

/**
 * The UnitRequirement class represents a {@link Requirement} has one base {@link StandaloneRequirement} and is only
 * fulfilled if sum of the number of units that fulfill its underlying base requirement is greater than a specified
 * number of units.
 */
export class UnitRequirement extends Requirement {
  units: number;
  requirement: StandaloneRequirement;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFulfilledWith(courses: Course[], override?: Set<string>): boolean {
    return this.unitsFulfilled(courses) >= this.units;
  }

  unitsFulfilled(courses: Course[]): number {
    return this.getFulfillingCourses(courses)
      .map((course) => course.units)
      .reduce((sum, units) => sum + units, 0);
  }

  getFulfillingCourses(courses: Course[]): Course[] {
    return courses.filter((course) => this.requirement.isFulfilled(course));
  }

  getCourseCombinations(courses: Course[]): Set<Course>[] {
    const filteredCourses = courses.filter((course) => this.requirement.isFulfilledWith([course]));
    return getAllCombinations(filteredCourses).map((combination) => new Set<Course>(combination));
  }

  toString(): string {
    return `${this.units} units of \n${this.requirement.name}`;
  }
}
