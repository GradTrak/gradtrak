import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { SingleRequirement } from 'models/requirements/single-requirement.model';

export class UnitRequirement implements Requirement {
  id: string;
  name: string;

  units: number;
  requirement: SingleRequirement;

  constructor(obj: object) {
    Object.assign(this, obj);
  }

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
