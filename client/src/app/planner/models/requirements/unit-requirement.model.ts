import { Course } from '../course.model';
import { Requirement } from '../requirement.model';
import { StandaloneRequirement } from './standalone-requirement.model';

/**
 * The UnitRequirement class represents a {@link Requirement} has one base {@link StandaloneRequirement} and is only
 * fulfilled if sum of the number of units that fulfill its underlying base requirement is greater than a specified
 * number of units.
 */
export class UnitRequirement extends Requirement {
  units: number;
  requirement: StandaloneRequirement;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFulfilledWith(courses: Course[], override: Set<string>): boolean {
    return this.unitsFulfilled(courses) >= this.units;
  }

  unitsFulfilled(courses: Course[]): number {
    return this.getFulfillingCourses(courses).reduce((sum, course) => sum + course.units, 0);
  }

  /**
  * Any COURSE that is a possible contribution to any child requirement is
  * a possible contribution to a UnitRequirement, and will return true.
  * @return whether the course could possibly help fullfill a requirement. 
  */
  getsContributed(course: Course): boolean {
    return this.requirements.any(requirement => requirement.getsContributed(course))
  }

  getFulfillingCourses(courses: Course[]): Course[] {
    return courses.filter((course) => this.requirement.isFulfillableBy(course));
  }

  toString(): string {
    return `${this.units} units of \n${this.requirement.name}`;
  }
}
