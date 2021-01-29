import { SchedulePrototype } from './schedule.prototype';

export type UserDataPrototype = {
  schedules: {
    [name: string]: SchedulePrototype,
  };
};
