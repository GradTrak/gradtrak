import { SemesterPrototype } from './semester.prototype';

export type SchedulePrototype = {
  semesters: {
    [year: string]: (SemesterPrototype | null)[];
  };
  goalIds: string[];
  manuallyFulfilledReqs: {
    [reqSetId: string]: string[];
  };
};
