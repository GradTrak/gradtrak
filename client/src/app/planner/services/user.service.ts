import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { SemesterPrototype } from 'common/prototypes/semester.prototype';
import { UserDataPrototype } from 'common/prototypes/user-data.prototype';
import { Course } from '../models/course.model';
import { Requirement } from '../models/requirement.model';
import { RequirementSet } from '../models/requirement-set.model';
import { Semester } from '../models/semester.model';
import { State } from '../models/state.model';
import { UserData } from '../models/user-data.model';
import { CourseService } from './course.service';
import { RequirementService } from './requirement.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  static readonly INITIAL_STATE: State = {
    loggedIn: false,
    username: null,
    userData: {
      semesters: [],
      goals: [],
      manuallyFulfilledReqs: new Map<string, Set<string>>(),
    },
  };

  private static readonly REGISTER_ENDPOINT = '/api/account/register';
  private static readonly LOGIN_ENDPOINT = '/api/account/login';
  private static readonly LOGOUT_ENDPOINT = '/api/account/logout';
  private static readonly WHOAMI_ENDPOINT = '/api/account/whoami';
  private static readonly PASSWORD_CHANGE_ENDPOINT = '/api/account/password';
  private static readonly SEMESTER_API_ENDPOINT = '/api/user';

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
   * Registers a user with the given username, password, and emailMarketing and userTesting preferences.
   *
   * @param {string} username The user's username.
   * @param {string} password The user's password.
   * @param {boolean} emailMarketing The user's emailMarketing preference.
   * @param {boolean} userTesting The user's userTesting preference.
   * @return {Observable<string>} An Observable that will emit an error string or null if the registration was
   * successful.
   */
  register(username: string, password: string, emailMarketing: boolean, userTesting: boolean): Observable<string> {
    if (this.currentState.loggedIn) {
      throw new Error('Tried to register when already logged in');
    }
    return this.http.post(UserService.REGISTER_ENDPOINT, { username, password, emailMarketing, userTesting }).pipe(
      tap((response: { success: boolean; username?: string; error?: string }) => {
        if (response.success) {
          this.state.next({
            ...this.currentState,
            loggedIn: true,
            username,
          });
        }
      }),
      map((response: { success: boolean; username?: string; error?: string }) =>
        response.error ? response.error : null,
      ),
    );
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
   * Queries the server to detect current login status and updates state accordingly.
   *
   * @return {Observable<string>} An Observable that contains the username
   * or null if not logged in.
   */
  queryWhoami(): Observable<string> {
    return this.http.get(UserService.WHOAMI_ENDPOINT).pipe(
      tap((response: { loggedIn: boolean; username?: string }) => {
        if (response.loggedIn) {
          this.state.next({
            ...this.currentState,
            loggedIn: true,
            username: response.username,
          });
        } else {
          this.state.next({
            ...this.currentState,
            loggedIn: false,
            username: null,
          });
        }
      }),
      map((response: { loggedIn: boolean; username?: string }) => {
        return response.loggedIn ? response.username : null;
      }),
    );
  }

  /**
   * Changes the user's password.
   *
   * @param {string} oldPassword The user's old password, used for verification.
   * @param {string} newPassword the user's new password.
   * @return {Observable<string>} The error in changing the password, null if the operation succeeded.
   */
  changePassword(oldPassword: string, newPassword: string): Observable<string> {
    return this.http
      .post(UserService.PASSWORD_CHANGE_ENDPOINT, {
        oldPassword,
        newPassword,
      })
      .pipe(map((err: { error?: string }) => (err ? err.error : null)));
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
          }).pipe(map(({ coursesMap, reqsMap }) => UserData.fromProto(userDataProto, coursesMap, reqsMap))),
        ),
      )
      .subscribe((userData: UserData) => {
        if (userData.semesters.length > 0) {
          this.state.next({
            ...this.currentState,
            userData,
          });
        } else {
          this.state.next({
            ...this.currentState,
          });
        }
      });
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
   * @param {RequirementSet[]} newGoals The new goals.
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
  // TODO Making this a function that returns a clone breaks the course-changer
  addCourse(course: Course, semester: Semester): void {
    if (semester.courses.includes(course)) {
      console.error(`Tried to add course ${course.id} to semester ${semester.name}, which it already has`);
      return;
    }

    semester.courses = [...semester.courses, course];
    this.state.next({
      ...this.currentState,
    });
  }

  /**
   * Removes a course from a given semester.
   *
   * @param {Course} course The course to remove.
   * @param {Semester} semester The semester from which to remove the course.
   */
  // TODO Making this a function that returns a clone breaks the course-changer
  removeCourse(course: Course, semester: Semester): void {
    if (!semester.courses.includes(course)) {
      console.error(`Tried to remove course ${course.id} from semester ${semester.name}, which it doesn't have`);
      return;
    }

    semester.courses = semester.courses.filter((c: Course) => c !== course);
    this.state.next({
      ...this.currentState,
    });
  }

  manuallyFulfill(requirement: Requirement, requirementSet: RequirementSet): void {
    const { manuallyFulfilledReqs } = this.currentState.userData;

    if (
      manuallyFulfilledReqs.has(requirementSet.id) &&
      manuallyFulfilledReqs.get(requirementSet.id).has(requirement.id)
    ) {
      console.error(
        `Tried to mark fulfilled requirement ${requirement.id} from set ${requirementSet.id}, which it already is`,
      );
      return;
    }

    if (manuallyFulfilledReqs.has(requirementSet.id)) {
      manuallyFulfilledReqs.get(requirementSet.id).add(requirement.id);
    } else {
      const newSet: Set<string> = new Set<string>();
      newSet.add(requirement.id);
      manuallyFulfilledReqs.set(requirementSet.id, newSet);
    }
    this.state.next({
      ...this.currentState,
    });
  }

  manuallyUnfulfill(requirement: Requirement, requirementSet: RequirementSet): void {
    const { manuallyFulfilledReqs } = this.currentState.userData;

    if (
      !manuallyFulfilledReqs.has(requirementSet.id) ||
      !manuallyFulfilledReqs.get(requirementSet.id).has(requirement.id)
    ) {
      console.error(
        `Tried to unmark fulfilled requirement ${requirement.id} from set ${requirementSet.id}, which it already isn't`,
      );
      return;
    }

    manuallyFulfilledReqs.get(requirementSet.id).delete(requirement.id);
    if (manuallyFulfilledReqs.get(requirementSet.id).size === 0) {
      manuallyFulfilledReqs.delete(requirementSet.id);
    }
    this.state.next({
      ...this.currentState,
    });
  }

  setUserData(userData: UserData): void {
    this.state.next({
      ...this.currentState,
      userData,
    });
  }

  private getPrototypeFromUserData(userData: UserData): UserDataPrototype {
    const semesters: SemesterPrototype[] = userData.semesters.map((semester: Semester) => {
      const semesterPrototype = {
        ...semester,
        courseIds: semester.courses.map((course: Course) => course.id),
      };
      delete semesterPrototype.courses;
      return semesterPrototype;
    });
    const goalIds: string[] = userData.goals.map((goal: RequirementSet) => goal.id);
    const manuallyFulfilledReqs: object = Object.fromEntries(
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
