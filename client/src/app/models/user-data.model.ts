import { SemesterPrototype } from 'common/prototypes/semester.prototype';
import { UserDataPrototype } from 'common/prototypes/user-data.prototype';
import { Course } from 'models/course.model';
import { RequirementSet } from 'models/requirement-set.model';
import { Semester } from 'models/semester.model';

export class UserData {
  semesters: Semester[];
  goals: RequirementSet[];

  constructor(proto: UserDataPrototype, coursesMap: Map<string, Course>, reqSetMap: Map<string, RequirementSet>) {
    this.semesters = proto.semesters.map((semesterProto: SemesterPrototype) => new Semester(semesterProto, coursesMap));
    this.goals = proto.goalIds.map((goalId: string) => reqSetMap.get(goalId));
  }
}
