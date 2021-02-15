import { UserDataPrototype } from '../../common/prototypes/user-data.prototype';
import { Course } from './course.model';
import { RequirementSet } from './requirement-set.model';
import { Schedule } from './schedule.model';

export class UserData {
  schedules: { [name: string]: Schedule };

  private constructor() {
    throw new Error('Disabled constructor');
  }

  static fromProto(
    proto: UserDataPrototype,
    coursesMap: Map<string, Course>,
    reqSetMap: Map<string, RequirementSet>,
  ): UserData {
    const schedules = Object.fromEntries(
      Object.entries(proto.schedules).map(([name, scheduleProto]) => [
        name,
        Schedule.fromProto(scheduleProto, coursesMap, reqSetMap),
      ]),
    );
    return {
      schedules,
    };
  }

  static toProto(userData: UserData): UserDataPrototype {
    const schedules = Object.fromEntries(
      Object.entries(userData.schedules).map(([name, schedule]) => [name, Schedule.toProto(schedule)]),
    );
    return {
      schedules,
    };
  }
}

export default UserData;
