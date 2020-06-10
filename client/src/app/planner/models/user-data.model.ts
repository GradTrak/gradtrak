import { SemesterPrototype } from 'common/prototypes/semester.prototype';
import { UserDataPrototype } from 'common/prototypes/user-data.prototype';
import { Course } from './course.model';
import { RequirementSet } from './requirement-set.model';
import { Semester } from './semester.model';

export class UserData {
  semesters: Map<string, Semester[]>;
  goals: RequirementSet[];
  manuallyFulfilledReqs: Map<string, Set<string>>;

  constructor(
    semesters: Map<string, Semester[]>,
    goals: RequirementSet[],
    manuallyFulfilledReqs?: Map<string, Set<string>>,
  ) {
    this.semesters = semesters;
    this.goals = goals;
    if (manuallyFulfilledReqs) {
      this.manuallyFulfilledReqs = manuallyFulfilledReqs;
    } else {
      this.manuallyFulfilledReqs = new Map<string, Set<string>>();
    }
  }

  static fromProto(
    proto: UserDataPrototype,
    coursesMap: Map<string, Course>,
    reqSetMap: Map<string, RequirementSet>,
  ): UserData {
    const semesters: Map<string, Semester[]> = new Map<string, Semester[]>();
    Object.entries(proto.semesters).forEach(([key, value]) => {
      semesters.set(
        key,
        value.map((semesterProto: SemesterPrototype) => semesterProto?(new Semester(semesterProto, coursesMap)):null),
      );
    });
    const goals: RequirementSet[] = proto.goalIds.map((goalId: string) => reqSetMap.get(goalId));
    const manuallyFulfilledReqs: Map<string, Set<string>> = new Map<string, Set<string>>();
    Object.entries(proto.manuallyFulfilledReqs).forEach((entry) => {
      manuallyFulfilledReqs.set(entry[0], new Set<string>(entry[1]));
    });
    return new UserData(semesters, goals, manuallyFulfilledReqs);
  }
}
