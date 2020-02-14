import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { UserDataPrototype } from 'common/prototypes/user-data.prototype';
import { Course } from 'models/course.model';
import { RequirementSet } from 'models/requirement-set.model';
import { Semester } from 'models/semester.model';
import { State } from 'models/state.model';
import { UserData } from 'models/user-data.model';
import { CourseService } from 'services/course.service';
import { RequirementService } from 'services/requirement.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private static readonly LOGIN_ENDPOINT = '/api/login';
  private static readonly LOGOUT_ENDPOINT = '/api/logout';
  private static readonly SEMESTER_API_ENDPOINT = '/api/user';

  private static readonly INITIAL_STATE: State = {
    loggedIn: false,
    username: null,
    userData: {
      semesters: [],
      goals: [],
    },
  };

  private readonly state: BehaviorSubject<State>;

  private currentState: State;

  constructor(
    private courseService: CourseService,
    private requirementService: RequirementService,
    private http: HttpClient,
  ) {
    this.state = new BehaviorSubject<State>(UserService.INITIAL_STATE);
    this.state.subscribe((state: State) => {
      this.currentState = state;
    });
  }

  getState(): Observable<State> {
    return this.state.asObservable();
  }

  /**
   * Logs into the application with the given username and password.
   *
   * @param {string} username The user's username.
   * @param {string} password The user's password.
   * @return {Observable<boolean>} An Observable that will emit whether the login was successful.
   */
  login(username: string, password: string): Observable<boolean> {
    if (this.currentState.loggedIn) {
      throw new Error('Tried to log in when already logged in');
    }

    return this.http.post(UserService.LOGIN_ENDPOINT, { username, password }).pipe(
      tap((response: { success: boolean; username?: string }) => {
        if (response.success) {
          this.state.next({
            ...this.currentState,
            loggedIn: true,
            username,
          });
        }
      }),
      map((response: { success: boolean; username?: string }) => response.success),
    );
  }

  /**
   * Logs the user out of the application.
   */
  logout(): void {
    if (!this.currentState.loggedIn) {
      throw new Error('Tried to log out when not logged in');
    }

    this.http.post(UserService.LOGOUT_ENDPOINT, null).subscribe(() => {
      this.state.next({
        ...this.currentState,
        loggedIn: false,
        username: null,
      });
    });
  }

  /**
   * Fetches the user data from the backend, instantiates the semesters, and takes the object and make it a list.
   */
  fetchUserData(): void {
    this.http
      .get(UserService.SEMESTER_API_ENDPOINT)
      .pipe(
        flatMap((userDataProto: UserDataPrototype) =>
          forkJoin({
            coursesMap: this.courseService.getCoursesMap(),
            reqsMap: this.requirementService.getRequirementsMap(),
          }).pipe(map(({ coursesMap, reqsMap }) => new UserData(userDataProto, coursesMap, reqsMap))),
        ),
      )
      .subscribe((userData: UserData) =>
        this.state.next({
          ...this.currentState,
          userData,
        }),
      );
  }

  saveUserData(): void {
    this.http
      .put(UserService.SEMESTER_API_ENDPOINT, this.getPrototypeFromUserData(this.currentState.userData))
      .subscribe();
  }

  /**
   * Updates the list of semesters to a new list of given semesters.
   *
   * @param {Semester[]} newSemesters The new semesters.
   */
  updateSemesters(newSemesters: Semester[]): void {
    this.state.next({
      ...this.currentState,
      userData: {
        ...this.currentState.userData,
        semesters: [...newSemesters],
      },
    });
  }

  /**
   * Updates the list of goals to a new list of given goals.
   *
   * @param {RequiremnetSet[]} newGoals The new goals.
   */
  updateGoals(newGoals: RequirementSet[]): void {
    this.state.next({
      ...this.currentState,
      userData: {
        ...this.currentState.userData,
        goals: [...newGoals],
      },
    });
  }

  /**
   * Adds a course to a given semester.
   *
   * @param {Course} course The course to add.
   * @param {Semester} semester The semester to which to add the course.
   */
  addCourse(course: Course, semester: Semester): void {
    this.state.next({
      ...this.currentState,
      userData: {
        ...this.currentState.userData,
        semesters: this.currentState.userData.semesters.map((s: Semester) => {
          if (s === semester) {
            return { ...s, courses: [...s.courses, course] };
          }
          return s;
        }),
      },
    });
  }

  /**
   * Removes a course from a given semester.
   *
   * @param {Course} course The course to remove.
   * @param {Semester} semester The semester from which to remove the course.
   */
  removeCourse(course: Course, semester: Semester): void {
    this.state.next({
      ...this.currentState,
      userData: {
        ...this.currentState.userData,
        semesters: this.currentState.userData.semesters.map((s: Semester) =>
          s === semester
            ? {
                ...s,
                courses: s.courses.filter((c: Course) => c !== course),
              }
            : s,
        ),
      },
    });
  }

  private getPrototypeFromUserData(userData: UserData): UserDataPrototype {
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
}
