import { SemesterPrototype } from '../../common/prototypes/semester.prototype';
import { UserDataPrototype } from '../../common/prototypes/user-data.prototype';
import { Course } from './course.model';
import { RequirementSet } from './requirement-set.model';
import { Semester } from './semester.model';

export class UserData {
  semesters: Map<string, Semester[]>;
  goals: RequirementSet[];
  manuallyFulfilledReqs: Map<string, Set<string>>;

  static fromProto(
    proto: UserDataPrototype,
    coursesMap: Map<string, Course>,
    reqSetMap: Map<string, RequirementSet>,
  ): UserData {
    const semesters = new Map<string, Semester[]>();
    Object.entries(proto.semesters).forEach(([key, value]) => {
      semesters.set(
        key,
        value.map((semesterProto) => (semesterProto ? Semester.fromProto(semesterProto, coursesMap) : null)),
      );
    });
    const goals = proto.goalIds.map((goalId) => reqSetMap.get(goalId));
    const manuallyFulfilledReqs = new Map<string, Set<string>>();
    Object.entries(proto.manuallyFulfilledReqs).forEach((entry) => {
      manuallyFulfilledReqs.set(entry[0], new Set<string>(entry[1]));
    });
    return {
      semesters,
      goals,
      manuallyFulfilledReqs,
    };
  }

  static toProto(userData: UserData): UserDataPrototype {
    const semesters: { [year: string]: SemesterPrototype[] } = {};
    userData.semesters.forEach((academicYearSemesters, academicYearName) => {
      semesters[academicYearName] = academicYearSemesters.map((semester) => {
        if (!semester) {
          return null;
        }
        const semesterPrototype = {
          name: semester.name,
          courseIds: semester.courses.map((course: Course) => course.id),
        };
        return semesterPrototype;
      });
    });
    const goalIds = userData.goals.map((goal) => goal.id);
    const manuallyFulfilledReqs = Object.fromEntries(
      Array.from(userData.manuallyFulfilledReqs.entries()).map((entry: [string, Set<string>]) => [
        entry[0],
        Array.from(entry[1]),
      ]),
    );
    return {
      semesters,
      goalIds,
      manuallyFulfilledReqs,
    };
  }
}

export default UserData;
