import { RequirementSetPrototype } from './requirement-set.prototype';
import { SemesterPrototype } from './semester.prototype';

export interface UserDataPrototype {
  semesters: SemesterPrototype[];
  goals: RequirementSetPrototype[];
}
