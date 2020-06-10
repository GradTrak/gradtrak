import { SemesterPrototype } from './semester.prototype';

export interface UserDataPrototype {
  semesters: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  goalIds: string[];
  manuallyFulfilledReqs: object;
}
