import { Semester } from '../models/semester.model';
import { UserData } from '../models/user-data.model';
import Courses from './courses';
import Requirements from './requirements';
import { get, post, put } from './utils';

type AuthType = 'local' | 'google';

export type Account = {
  username: string;
  auth: AuthType;
};

namespace User {
  const REGISTER_ENDPOINT = '/api/account/register';
  const LOGIN_ENDPOINT = '/api/account/login';
  const LOGOUT_ENDPOINT = '/api/account/logout';
  const WHOAMI_ENDPOINT = '/api/account/whoami';
  const PASSWORD_CHANGE_ENDPOINT = '/api/account/password';
  const SEMESTER_API_ENDPOINT = '/api/user';

  export const EMPTY_USER_DATA = {
    semesters: new Map<string, Semester[]>(),
    goals: [],
    manuallyFulfilledReqs: new Map<string, Set<string>>(),
  };

  // TODO Specify this type and other API types as a union.
  type RegisterResponse =
    | {
        success: true;
        user: Account;
      }
    | {
        success: false;
        error: string;
      };

  /**
   * Registers a user with the given username, password, and
   * userTesting preferences.
   *
   * @param {string} username The user's username.
   * @param {string} password The user's password.
   * @param {boolean} userTesting The user's userTesting preference.
   * @return {Promise<RegisterResponse>} A Promise that resolves with the
   * server's response.
   */
  export async function register(username: string, password: string, userTesting: boolean): Promise<RegisterResponse> {
    const res = await post(REGISTER_ENDPOINT, { username, password, userTesting });
    return res.json();
  }

  type LoginResponse =
    | {
        success: true;
        user: Account;
      }
    | {
        success: false;
        error: string;
      };

  /**
   * Logs into the application with the given username and password.
   *
   * @param {string} username The user's username.
   * @param {string} password The user's password.
   * @return {Promise<LoginResponse>} A Promise that resolves with the server's
   * response.
   */
  export async function login(username: string, password: string): Promise<LoginResponse> {
    const res = await post(LOGIN_ENDPOINT, { username, password });
    return res.json();
  }

  /**
   * Logs the user out of the application.
   */
  export async function logout(): Promise<void> {
    await post(LOGOUT_ENDPOINT, null);
  }

  type WhoamiResponse =
    | {
        loggedIn: true;
        user: Account;
      }
    | { loggedIn: false };

  /**
   * Queries the server to detect current login status and updates state
   * accordingly.
   *
   * @return {Promise<WhoamiResponse>} A Promise that resolves with the
   * server's response.
   */
  export async function whoami(): Promise<WhoamiResponse> {
    const res = await get(WHOAMI_ENDPOINT);
    return res.json();
  }

  type ChangePasswordResponse = {
    error?: string;
  };

  /**
   * Changes the user's password.
   *
   * @param {string} oldPassword The user's old password, used for
   * verification.
   * @param {string} newPassword the user's new password.
   * @return {Promise<ChangePasswordResponse>} A Promise that resolves with the server's
   * response.
   */
  export async function changePassword(oldPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
    const res = await post(PASSWORD_CHANGE_ENDPOINT, { oldPassword, newPassword });
    return res.json();
  }

  /**
   * Fetches the user data from the backend, instantiates the semesters, and
   * takes the object and makes it a list.
   *
   * @return {Promise<UserData>} The user data from the server.
   */
  export async function fetchUserData(): Promise<UserData> {
    const [res, coursesMap, reqsMap] = await Promise.all([
      get(SEMESTER_API_ENDPOINT),
      Courses.getCoursesMap(),
      Requirements.getRequirementsMap(),
    ]);
    const userDataProto = await res.json();
    return UserData.fromProto(userDataProto, coursesMap, reqsMap);
  }

  /**
   * Saves the given user data to the server.
   *
   * @param {UserData} userData The user data to save.
   */
  export async function saveUserData(userData: UserData): Promise<void> {
    await put(SEMESTER_API_ENDPOINT, UserData.toProto(userData));
  }
}

export default User;
