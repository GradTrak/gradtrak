import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class UnitRequirement extends Requirement {
  id: string;
  name: string;

  units: number;
  // TODO Add StandaloneRequirement interface
  requirement: Requirement;

  isFulfilled(courses: Course[]): boolean {
    return this.unitsFulfilled(courses) >= this.units;
  }

  unitsFulfilled(courses: Course[]): number {
    return this.getFulfillingCourses(courses).reduce((sum, course) => sum + course.units, 0);
  }

  getFulfillingCourses(courses: Course[]): Course[] {
    return courses.filter((course) => this.requirement.isFulfilled([course]));
  }

  toString(): string {
    return `${this.units} units of\n${this.requirement.name}`;
  }
}
