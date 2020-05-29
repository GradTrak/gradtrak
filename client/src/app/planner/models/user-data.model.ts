import { SemesterPrototype } from 'common/prototypes/semester.prototype';
import { UserDataPrototype } from 'common/prototypes/user-data.prototype';
import { Course } from './course.model';
import { RequirementSet } from './requirement-set.model';
import { Semester } from './semester.model';

export class UserData {
  semesters: Semester[];
  goals: RequirementSet[];
  manuallyFulfilledReqs: Map<string, Set<string>>;

  constructor(proto: UserDataPrototype, coursesMap: Map<string, Course>, reqSetMap: Map<string, RequirementSet>) {
    this.semesters = proto.semesters.map((semesterProto: SemesterPrototype) => new Semester(semesterProto, coursesMap));
    this.goals = proto.goalIds.map((goalId: string) => reqSetMap.get(goalId));
    this.manuallyFulfilledReqs = new Map<string, Set<string>>();
    Object.entries(proto.manuallyFulfilledReqs).forEach((entry) => {
      this.manuallyFulfilledReqs.set(entry[0], new Set<string>(entry[1]));
    });
  }
}