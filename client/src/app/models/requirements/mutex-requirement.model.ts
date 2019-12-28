/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course } from 'models/course.model';
import { Requirement } from 'models/requirement.model';
import { SingleRequirement } from 'models/requirements/single-requirement.model';

export class MutexRequirement implements Requirement {
  static readonly UNFULFILLED = 0;
  static readonly POTENTIAL = 1;
  static readonly FULFILLED = 2;

  id: string;
  name: string;

  requirements: SingleRequirement[];

  constructor(obj: object) {
    Object.assign(this, obj);
  }

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
  getFulfillment(courses: Course[]): { requirement: Requirement; fulfillment: number }[] {
    const fulfilled: Set<Requirement> = new Set();
    const potential: Set<Requirement> = new Set();

    const coursesWithReqs: any[] = this.mapReqsToCourses(courses);

    coursesWithReqs.forEach((courseWithReqs: any) => {
      // Exclude Requirements already guarenteed fulfilled
      const linkedCourses: Set<any> = new Set([courseWithReqs]);
      const linkedReqs: Set<any> = new Set(courseWithReqs.requirements);

      let lastCourseSize: number = 0;
      let lastReqsSize: number = 0;

      while (lastCourseSize !== linkedCourses.size || lastReqsSize !== linkedReqs.size) {
        lastCourseSize = linkedCourses.size;
        lastReqsSize = linkedReqs.size;

        Array.from(linkedReqs)
          .flatMap((linkedReq: any) => linkedReq.courses)
          .forEach((linkedCourse: any) => linkedCourses.add(linkedCourse));
        Array.from(linkedCourses)
          .flatMap((linkedCourse: any) => linkedCourse.requirements)
          .forEach((linkedReq: any) => linkedReqs.add(linkedReq));
      }

      if (linkedCourses.size >= linkedReqs.size) {
        Array.from(linkedReqs)
          .map((linkedReq: any) => linkedReq.requirement)
          .forEach((req: Requirement) => fulfilled.add(req));
      } else if (linkedCourses.size > 0) {
        Array.from(linkedReqs)
          .map((linkedReq: any) => linkedReq.requirement)
          .forEach((req: Requirement) => potential.add(req));
      }
    });

    return this.requirements.map((requirement: Requirement) => {
      let fulfillment: number;
      if (fulfilled.has(requirement)) {
        fulfillment = MutexRequirement.FULFILLED;
      } else if (potential.has(requirement)) {
        fulfillment = MutexRequirement.POTENTIAL;
      } else {
        fulfillment = MutexRequirement.UNFULFILLED;
      }

      return {
        requirement,
        fulfillment,
      };
    });
  }

  getAnnotation(): string {
    return null;
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
   * @return - An array of objects which each contain a Course and an array of objects with Requirements and backreferences.
   */
  // TODO This feels really janky
  private mapReqsToCourses(courses: Course[]): any[] {
    const reqsToCourses: any[] = this.requirements.map((requirement: SingleRequirement) => {
      return {
        requirement,
        courses: courses.filter((course: Course) => requirement.isFulfillableBy(course)),
      };
    });
    const coursesToReqs: any[] = courses.map((course: Course) => {
      return {
        course,
        requirements: this.requirements
          .filter((requirement: Requirement) => requirement.isFulfilled([course]))
          .map((req: Requirement) => reqsToCourses.find((reqWithCourses: any) => reqWithCourses.requirement === req)),
      };
    });

    coursesToReqs.forEach((courseWithReqs: any) => {
      courseWithReqs.requirements.forEach((req: any) => {
        req.courses = req.courses.map((course: Course) => (course === courseWithReqs.course ? courseWithReqs : course));
      });
    });

    return coursesToReqs.filter((courseWithReqs: any) => courseWithReqs.requirements.length > 0);
  }
}
