/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Course } from 'models/course.model';
import { RequirementSet } from 'models/requirement-set.model';
import { Semester } from 'models/semester.model';
import { UserData } from 'models/user-data.model';
import { CourseService } from 'services/course.service';
import { RequirementService } from 'services/requirement.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private static readonly SEMESTER_API_ENDPOINT = '/api/user';

  private static readonly INITIAL_STATE: UserData = {
    semesters: [],
    goals: [],
  };

  private readonly userData: BehaviorSubject<UserData>;

  private userDataState: UserData;

  constructor(
    private courseService: CourseService,
    private requirementService: RequirementService,
    private http: HttpClient,
  ) {
    this.userData = new BehaviorSubject<UserData>(UserService.INITIAL_STATE);
    this.userData.subscribe((userData: UserData) => {
      this.userDataState = userData;
    });
  }

  getUserData(): Observable<UserData> {
    return this.userData.asObservable();
  }

  /**
   * Fetches the user data from the backend, instantiates the semesters, and takes the object and make it a list.
   */
  fetchUserData(): void {
    this.http
      .get(UserService.SEMESTER_API_ENDPOINT)
      .pipe(flatMap((userData: any) => this.getUserDataFromPrototype(userData)))
      .subscribe((userData: UserData) => this.userData.next(userData));
  }

  saveUserData(): void {
    this.http.put(UserService.SEMESTER_API_ENDPOINT, this.getPrototypeFromUserData(this.userDataState)).subscribe();
  }

  /**
   * Updates the list of semesters to a new list of given semesters.
   *
   * @param {Semester[]} newSemesters The new semesters.
   */
  updateSemesters(newSemesters: Semester[]): void {
    this.userData.next({
      ...this.userDataState,
      semesters: [...newSemesters],
    });
  }

  /**
   * Updates the list of goals to a new list of given goals.
   *
   * @param {RequiremnetSet[]} newGoals The new goals.
   */
  updateGoals(newGoals: RequirementSet[]): void {
    this.userData.next({
      ...this.userDataState,
      goals: [...newGoals],
    });
  }

  /**
   * Adds a course to a given semester.
   *
   * @param {Course} course The course to add.
   * @param {Semester} semester The semester to which to add the course.
   */
  addCourse(course: Course, semester: Semester): void {
    this.userData.next({
      ...this.userDataState,
      semesters: this.userDataState.semesters.map((s: Semester) =>
        s === semester
          ? {
              ...s,
              courses: [...s.courses, course],
            }
          : s,
      ),
    });
  }

  /**
   * Removes a course from a given semester.
   *
   * @param {Course} course The course to remove.
   * @param {Semester} semester The semester from which to remove the course.
   */
  removeCourse(course: Course, semester: Semester): void {
    this.userData.next({
      ...this.userDataState,
      semesters: this.userDataState.semesters.map((s: Semester) =>
        s === semester
          ? {
              ...s,
              courses: s.courses.filter((c: Course) => c !== course),
            }
          : s,
      ),
    });
  }

  private getPrototypeFromUserData(userData: UserData): any {
    return {
      semesters: userData.semesters.map((semester: Semester) => {
        const semesterPrototype = {
          ...semester,
          courseIds: semester.courses.map((course: Course) => course.id),
        };
        delete semesterPrototype.courses;
        return semesterPrototype;
      }),
      goalIds: userData.goals.map((goal: RequirementSet) => goal.id),
    };
  }

  private getUserDataFromPrototype(prototype: any): Observable<UserData> {
    return forkJoin({
      coursesMap: this.courseService.getCoursesMap(),
      reqsMap: this.requirementService.getRequirementsMap(),
    }).pipe(
      map((serviceObj) => ({
        semesters: prototype.semesters.map((rawSemester: any) =>
          this.instantiateSemester(rawSemester, serviceObj.coursesMap),
        ),
        goals: prototype.goalIds.map((goalId: string) => serviceObj.reqsMap.get(goalId)),
      })),
    );
  }

  private instantiateSemester(semesterPrototype: any, coursesObj: Map<string, Course>): Semester {
    const semester = {
      ...semesterPrototype,
      courses: semesterPrototype.courseIds.map((courseId: string) => coursesObj.get(courseId)),
    };
    delete semester.courseIds;
    return semester;
  }
}
