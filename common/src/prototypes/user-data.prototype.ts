import { SemesterPrototype } from './semester.prototype';

export type UserDataPrototype = {
  semesters: {
    [year: string]: SemesterPrototype[];
  };
  goalIds: string[];
  manuallyFulfilledReqs: {
    [reqSetId: string]: string[];
  };
}
