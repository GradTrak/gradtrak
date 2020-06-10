import { SemesterPrototype } from './semester.prototype';

export interface UserDataPrototype {
  semesters: Map<string, SemesterPrototype[]>;
  goalIds: string[];
  manuallyFulfilledReqs: object;
}
