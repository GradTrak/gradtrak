import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { StandaloneRequirement } from 'models/requirements/standalone-requirement.model';

/**
 * The UnitRequirement class represents a {@link Requirement} has one base {@link StandaloneRequirement} and is only
 * fulfilled if sum of the number of units that fulfill its underlying base requirement is greater than a specified
 * number of units.
 */
export class UnitRequirement extends Requirement {
  units: number;
  requirement: StandaloneRequirement;

  isFulfilled(courses: Course[]): boolean {
    return this.unitsFulfilled(courses) >= this.units;
  }

  unitsFulfilled(courses: Course[]): number {
    return this.getFulfillingCourses(courses).reduce((sum, course) => sum + course.units, 0);
  }

  getFulfillingCourses(courses: Course[]): Course[] {
    return courses.filter((course) => this.requirement.isFulfillableBy(course));
  }

  getAnnotation(): string {
    return null;
  }

  toString(): string {
    return `${this.units} units of \n${this.requirement.name}`;
  }
}
