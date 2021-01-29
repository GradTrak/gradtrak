import { UserDataPrototype } from '../../common/prototypes/user-data.prototype';
import { Course } from './course.model';
import { RequirementSet } from './requirement-set.model';
import { Semester } from './semester.model';

export class UserData {
  semesters: { [year: string]: (Semester | null)[] };
  goals: RequirementSet[];
  manuallyFulfilledReqs: { [reqSet: string]: string[] };

  private constructor() {
    throw new Error('Disabled constructor');
  }

  static fromProto(
    proto: UserDataPrototype,
    coursesMap: Map<string, Course>,
    reqSetMap: Map<string, RequirementSet>,
  ): UserData {
    const semesters = Object.fromEntries(
      Object.entries(proto.semesters).map(([year, semesterProtos]) => [
        year,
        semesterProtos.map((semesterProto) => (semesterProto ? Semester.fromProto(semesterProto, coursesMap) : null)),
      ]),
    );
    const goals = proto.goalIds
      .filter((goalId) => {
        /* Check for goal in reqSetMap. */
        if (!reqSetMap.has(goalId)) {
          console.error(`Goals reference unknown requirement set ID: ${goalId}`);
          return false;
        }
        return true;
      })
      .map((goalId) => reqSetMap.get(goalId)!);
    const { manuallyFulfilledReqs } = proto;
    return {
      semesters,
      goals,
      manuallyFulfilledReqs,
    };
  }

  static toProto(userData: UserData): UserDataPrototype {
    const semesters = Object.fromEntries(
      Object.entries(userData.semesters).map(([year, sems]) => [
        year,
        sems.map((sem) => (sem ? Semester.toProto(sem) : null)),
      ]),
    );
    const goalIds = userData.goals.map((goal) => goal.id);
    const { manuallyFulfilledReqs } = userData;
    return {
      semesters,
      goalIds,
      manuallyFulfilledReqs,
    };
  }
}

export default UserData;
