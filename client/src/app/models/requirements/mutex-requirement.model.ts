/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';

export class MutexRequirement extends Requirement {
  static readonly UNFULFILLED = 0;
  static readonly POTENTIAL = 1;
  static readonly FULFILLED = 2;

  requirements: Requirement[];

  isFulfilled(courses: Course[]): boolean {
    return this.getFulfillment(courses).every(
      (reqFulfillment: { requirement: Requirement; fulfillment: number }) =>
        reqFulfillment.fulfillment === MutexRequirement.FULFILLED,
    );
  }

  /**
   * Returns an array of objects containing each sub-Requirement and its current fulfillment status based on the given
   * Courses.
   *
   * @param {Course[]} courses - The input Courses that are currently being taken.
   * @return - An array of objects each containing a Requirement and a fulfillment status.
   */
  // FIXME Make this functional
  getFulfillment(courses: Course[]): { requirement: Requirement; fulfillment: number }[] {
    const fulfilled: Requirement[] = [];
    const potential: Requirement[] = [];

    const reqsWithCourses: any[] = this.mapCoursesToReqs(courses);

    reqsWithCourses.forEach((reqWithCourses: any) => {
      // Exclude Requirements already guarenteed fulfilled
      if (!fulfilled.includes(reqWithCourses.requirement)) {
        const linkedReqs = new Set([reqWithCourses]);
        const linkedCourses = new Set(reqWithCourses.courses);

        linkedCourses.forEach((linkedCourse: any) => {
          linkedCourse.requirements.forEach((linkedReq: any) => {
            linkedReqs.add(linkedReq);
          });
        });
      }
    });

    return this.requirements.map((requirement: Requirement) => {
      return {
        requirement,
        fulfillment: MutexRequirement.FULFILLED,
      };
    });
  }

  toString(): string {
    return this.requirements.reduce(
      (annotation: string, requirement: Requirement) => `${annotation}\n${requirement.toString()}`,
      'Uniquely fulfill:',
    );
  }

  /**
   * Returns an array of objects containing circular references between each Requirement and the Courses that fulfill
   * it and each Course and the Requirements it fulfills, used to determine the fulfillment status of each individual
   * requirement of the MutexRequirement.
   *
   * @param {Course[]} courses - The input Courses that will be mapped with the instance {@link MutexRequirement#requirements}.
   * @return - An array of objects which each contain a Requirement and an array of objects with Courses and backreferences.
   */
  // TODO This feels really janky
  private mapCoursesToReqs(courses: Course[]): any[] {
    const coursesToReqs: any[] = courses.map((course: Course) => {
      return {
        course,
        requirements: this.requirements.filter((requirement: Requirement) => requirement.isFulfilled([course])),
      };
    });
    const reqsToCourses: any[] = this.requirements.map((requirement: Requirement) => {
      return {
        requirement,
        courses: courses
          .filter((course: Course) => requirement.isFulfilled([course]))
          .map((course: Course) => coursesToReqs.find((courseWithReqs) => courseWithReqs.course === course)),
      };
    });

    reqsToCourses.forEach((req: any) => {
      req.courses.forEach((course: any) => {
        course.requirements = course.requirements.map((requirement: Requirement) =>
          requirement === req.requirement ? req : requirement,
        );
      });
    });

    return reqsToCourses;
  }
}
