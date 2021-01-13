import React from 'react';
import { Course } from './models/course.model';
import { Requirement } from './models/requirement.model';
import { RequirementSet } from './models/requirement-set.model';
import { Semester } from './models/semester.model';
import { StandaloneRequirement } from './models/requirements/standalone-requirement.model';
import { UserData } from './models/user-data.model';
import User, { AuthType } from './lib/user';
import logo from './logo.svg';
import './App.css';

type AppProps = {};

type ModalState =
  | {
      type: 'login' | 'initializer' | 'account-editor' | 'report-form' | 'goal-selector' | 'semester-changer';
    }
  | {
      type: 'course-adder';
      semester: Semester;
    }
  | {
      type: 'requirement-display';
      requirement: StandaloneRequirement;
    };

type AppState = {
  loggedIn: boolean;
  user: {
    username: string;
    auth: AuthType;
  };
  userData: UserData;
  isLoading: boolean;
  modal: ModalState;
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
      isLoading: true,
      modal: null,
    };
  }

  closeModal = (): void => {
    this.setState({
      modal: null,
    });
  };

  openLogin = (): void => {
    this.setState({
      modal: {
        type: 'login',
      },
    });
  };

  onLoginDismiss = (): void => {
    this.closeModal();
    if (this.state.userData.semesters.size === 0) {
      this.openInitializer();
    }
  };

  openInitializer = (): void => {
    this.setState({
      modal: {
        type: 'initializer',
      },
    });
  };

  openAccountEditor = (): void => {
    this.setState({
      modal: {
        type: 'account-editor',
      },
    });
  };

  openReportForm = (): void => {
    this.setState({
      modal: {
        type: 'report-form',
      },
    });
  };

  openGoalSelector = (): void => {
    this.setState({
      modal: {
        type: 'goal-selector',
      },
    });
  };

  openSemesterChanger = (): void => {
    this.setState({
      modal: {
        type: 'semester-changer',
      },
    });
  };

  openCourseAdder = (semester: Semester): void => {
    this.setState({
      modal: {
        type: 'course-adder',
        semester,
      },
    });
  };

  openRequirementDisplay = (requirement: StandaloneRequirement): void => {
    this.setState({
      modal: {
        type: 'requirement-display',
        requirement,
      },
    });
  };

  register = async (username: string, password: string, userTesting: boolean): Promise<boolean> => {
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
  };

  login = async (username: string, password: string): Promise<boolean> => {
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
  };

  /**
   * Logs the user out of the application.
   */
  logout = async (): Promise<void> => {
    if (!this.state.loggedIn) {
      throw new Error('Tried to log out when not logged in');
    }

    await User.logout();
    this.setState({
      ...this.state,
      loggedIn: false,
      user: null,
    });
  };

  queryWhoami = async (): Promise<string> => {
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
  };

  changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!this.state.loggedIn || this.state.user.auth !== 'local') {
      throw new Error('Tried to change password in invalid state');
    }

    const res = await User.changePassword(oldPassword, newPassword);
    return Boolean(res.error);
  };

  fetchUserData = async (): Promise<void> => {
    const userData = await User.fetchUserData();
    if (userData.semesters.size > 0) {
      this.setState({
        ...this.state,
        userData,
      });
    }
  };

  /**
   * Updates the list of semesters to a new mapping of given semesters.
   *
   * @param {Map<string, Semester[]>} newSemesters The new semesters.
   */
  updateSemesters = (newSemesters: Map<string, Semester[]>): void => {
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
  };

  /**
   * Updates the list of goals to a new list of given goals.
   *
   * @param {RequirementSet[]} newGoals The new goals.
   */
  updateGoals = (newGoals: RequirementSet[]): void => {
    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        goals: [...newGoals],
      },
    });
  };

  /**
   * Adds a course to a given semester.
   *
   * @param {Course} course The course to add.
   * @param {Semester} semester The semester to which to add the course.
   */
  addCourse = (course: Course, semester: Semester): void => {
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
  };

  /**
   * Removes a course from a given semester.
   *
   * @param {Course} course The course to remove.
   * @param {Semester} semester The semester from which to remove the course.
   */
  removeCourse = (course: Course, semester: Semester): void => {
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
  };

  manuallyFulfill = (requirement: Requirement, requirementSet: RequirementSet): void => {
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
  };

  manuallyUnfulfill = (requirement: Requirement, requirementSet: RequirementSet): void => {
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
  };

  setUserData = (userData: UserData): void => {
    this.setState({
      ...this.state,
      userData,
    });
  };

  /**
   * Gets a list of all the courses a user is currently taking, in the form of
   * an array, based on the currrent state and userdata.
   *
   * @return {Course[]} A list of courses that are in the state.
   */
  private getCurrentCourses = (): Course[] => {
    return Array.from(this.state.userData.semesters.values())
      .flat()
      .filter((semester: Semester) => semester)
      .flatMap((semester: Semester) => semester.courses);
  };

  private renderName = (): React.ReactElement => {
    if (this.state.loggedIn) {
      return (
        <>
          <div className="left">Name: {this.state.user.username}</div>
          <div className="right">
            <button className="gt-button" onClick={this.openAccountEditor}>
              Account
            </button>
            <span> | </span>
            <button className="gt-button" onClick={this.logout}>
              Logout
            </button>
            <span> | </span>
            <a
              className="gt-button"
              href="https://docs.google.com/document/d/1sr9zSIZItja7008yAB5kYDhEZv-1SO0I7zIJtUmZ0Kk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help
            </a>
            <span> | &nbsp;</span>
            <i className="material-icons" onClick={this.openReportForm}>
              flag
            </i>
          </div>
        </>
      );
    } else {
      /* Not logged in. */
      return (
        <>
          <div className="left">Guest User</div>
          <div className="right">
            <button className="gt-button" onClick={this.openLogin}>
              Register to Save
            </button>
            <span> | </span>
            <a
              className="gt-button"
              href="https://docs.google.com/document/d/1sr9zSIZItja7008yAB5kYDhEZv-1SO0I7zIJtUmZ0Kk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help
            </a>
            <span> | &nbsp;</span>
            <i className="material-icons" onClick={this.openReportForm}>
              flag
            </i>
          </div>
        </>
      );
    }
  };

  private renderBody(): React.ReactElement {
    if (!this.state.isLoading) {
      return (
        <div className="row no-gutters main">
          <SemesterPane
            className="col-8"
            semesters={this.state.userData.semesters}
            onOpenSemesterChanger={this.openSemesterChanger()}
            onOpenCourseAdder={this.openCourseAdder}
          />
          <RequirementsPane
            className="col-4"
            courses={this.getCurrentCourses()}
            goals={this.state.userData.goals}
            manuallyFulfilled={this.state.userData.manuallyFulfilledReqs}
            onOpenGoalSelector={this.openGoalSelector}
            onOpenRequirementDisplay={this.openRequirementDisplay}
          />
        </div>
      );
    } else {
      /* Loading. */
      return <div>Loading...</div>;
    }
  }

  render(): React.ReactElement {
    return (
      <>
        <div className="header">
          <div className="title">
            GradTrak<sup className="beta">BETA</sup>
          </div>
          <div className="name">{this.renderName()}</div>
        </div>
        <div className="body">{this.renderBody()}</div>
      </>
    );
  }
}

export default App;
