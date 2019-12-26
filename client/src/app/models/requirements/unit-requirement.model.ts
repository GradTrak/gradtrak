import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class UnitRequirement extends Requirement {
  id: string;
  name: string;

  units: number;
  requirement: Requirement;

  isFulfilled(courses: Course[]): boolean {
    return (
      courses
        .filter((course) => this.requirement.isFulfilled([course]))
        .reduce((sum, course) => sum + course.units, 0) >= this.units
    );
  }

  toString(): string {
    return `${this.units} units of\n${this.requirement.name}`;
  }
}
