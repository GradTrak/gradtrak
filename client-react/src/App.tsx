import React from 'react';
import { Course } from './models/course.model';
import { Requirement } from './models/requirement.model';
import { RequirementSet } from './models/requirement-set.model';
import { Semester } from './models/semester.model';
import { UserData } from './models/user-data.model';
import User, { AuthType } from './lib/user';
import logo from './logo.svg';
import './App.css';
type AppProps = {};

type AppState = {
  loggedIn: boolean;
  user: {
    username: string;
    auth: AuthType;
  };

  userData: UserData;
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      loggedIn: false,
      user: {
        username: null,
        auth: null,
      },
      userData: {
        semesters: new Map<string, Semester[]>(),
        goals: [],
        manuallyFulfilledReqs: new Map<string, Set<string>>(),
      },
    };
  }

  async register(username: string, password: string, userTesting: boolean): Promise<boolean> {
    if (this.state.loggedIn) {
      throw new Error('Tried to register when already logged in');
    }

    const res = await User.register(username, password, userTesting);
    if (res.success) {
      this.setState({
        ...this.state,
        loggedIn: true,
        user: {
          username: res.username,
          auth: res.auth,
        },
      });
    }
    return res.success;
  }

  async login(username: string, password: string): Promise<boolean> {
    if (this.state.loggedIn) {
      throw new Error('Tried to register when already logged in');
    }

    const res = await User.login(username, password);
    if (res.success) {
      this.setState({
        ...this.state,
        loggedIn: true,
        user: {
          username: res.username,
          auth: res.auth,
        },
      });
    }
    return res.success;
  }

  /**
   * Logs the user out of the application.
   */
  async logout(): Promise<void> {
    if (!this.state.loggedIn) {
      throw new Error('Tried to log out when not logged in');
    }

    await User.logout();
    this.setState({
      ...this.state,
      loggedIn: false,
      user: null,
    });
  }

  async queryWhoami(): Promise<string> {
    const res = await User.whoami();
    if (res.loggedIn) {
      this.setState({
        ...this.state,
        loggedIn: true,
        user: {
          username: res.username,
          auth: res.auth,
        },
      });
    } else {
      this.setState({
        ...this.state,
        loggedIn: false,
        user: null,
      });
    }
    return res.loggedIn ? res.username : null;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    if (!this.state.loggedIn || this.state.user.auth !== 'local') {
      throw new Error('Tried to change password in invalid state');
    }

    const res = await User.changePassword(oldPassword, newPassword);
    return Boolean(res.error);
  }

  async fetchUserData(): Promise<void> {
    const userData = await User.fetchUserData();
    if (userData.semesters.size > 0) {
      this.setState({
        ...this.state,
        userData,
      });
    }
  }

  /**
   * Updates the list of semesters to a new mapping of given semesters.
   *
   * @param {Map<string, Semester[]>} newSemesters The new semesters.
   */
  updateSemesters(newSemesters: Map<string, Semester[]>): void {
    // not sure why, before the rework the list of semesters was copied, so
    // I've copied the map here as well.
    const newMap = new Map<string, Semester[]>();
    newSemesters.forEach((value, key) => {
      newMap.set(key, [...value]);
    });
    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        semesters: newMap,
      },
    });
  }

  /**
   * Updates the list of goals to a new list of given goals.
   *
   * @param {RequirementSet[]} newGoals The new goals.
   */
  updateGoals(newGoals: RequirementSet[]): void {
    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
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
    if (semester.courses.includes(course)) {
      console.error(`Tried to add course ${course.id} to semester ${semester.name}, which it already has`);
      return;
    }

    // TODO Making this a function that returns a clone breaks the
    // course-changer
    semester.courses = [...semester.courses, course];
    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        semesters: new Map<string, Semester[]>(this.state.userData.semesters),
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
    if (!semester.courses.includes(course)) {
      console.error(`Tried to remove course ${course.id} from semester ${semester.name}, which it doesn't have`);
      return;
    }

    // TODO Making this a function that returns a clone breaks the course-changer
    semester.courses = semester.courses.filter((c: Course) => c !== course);
    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        semesters: new Map<string, Semester[]>(this.state.userData.semesters),
      },
    });
  }

  manuallyFulfill(requirement: Requirement, requirementSet: RequirementSet): void {
    const { manuallyFulfilledReqs } = this.state.userData;

    if (
      manuallyFulfilledReqs.has(requirementSet.id) &&
      manuallyFulfilledReqs.get(requirementSet.id).has(requirement.id)
    ) {
      console.error(
        `Tried to mark fulfilled requirement ${requirement.id} from set ${requirementSet.id}, which it already is`,
      );
      return;
    }

    const nextSet: Set<string> = new Set<string>(manuallyFulfilledReqs.get(requirementSet.id));
    nextSet.add(requirement.id);

    const nextManuallyFulfilled: Map<string, Set<string>> = new Map(manuallyFulfilledReqs);
    nextManuallyFulfilled.set(requirementSet.id, nextSet);

    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        manuallyFulfilledReqs: nextManuallyFulfilled,
      },
    });
  }

  manuallyUnfulfill(requirement: Requirement, requirementSet: RequirementSet): void {
    const { manuallyFulfilledReqs } = this.state.userData;

    if (
      !manuallyFulfilledReqs.has(requirementSet.id) ||
      !manuallyFulfilledReqs.get(requirementSet.id).has(requirement.id)
    ) {
      console.error(
        `Tried to unmark fulfilled requirement ${requirement.id} from set ${requirementSet.id}, which it already isn't`,
      );
      return;
    }

    const nextManuallyFulfilled: Map<string, Set<string>> = new Map(manuallyFulfilledReqs);
    const nextSet: Set<string> = new Set<string>(manuallyFulfilledReqs.get(requirementSet.id));
    nextManuallyFulfilled.set(requirementSet.id, nextSet);

    nextSet.delete(requirement.id);
    if (nextSet.size === 0) {
      nextManuallyFulfilled.delete(requirementSet.id);
    }
    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        manuallyFulfilledReqs: nextManuallyFulfilled,
      },
    });
  }

  setUserData(userData: UserData): void {
    this.setState({
      ...this.state,
      userData,
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
