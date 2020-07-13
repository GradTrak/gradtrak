import { SemesterPrototype } from './semester.prototype';

export interface UserDataPrototype {
  semesters: {
    [year: string]: SemesterPrototype[];
  };
  goalIds: string[];
  manuallyFulfilledReqs: {
    [reqSetId: string]: string[];
  };
}
