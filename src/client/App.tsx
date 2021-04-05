import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';

import { Course } from './models/course.model';
import { Requirement } from './models/requirement.model';
import { RequirementSet } from './models/requirement-set.model';
import { Schedule } from './models/schedule.model';
import { Semester } from './models/semester.model';
import { UserData } from './models/user-data.model';
import Courses from './lib/courses';
import Requirements from './lib/requirements';
import Tags from './lib/tags';
import User, { Account } from './lib/user';

import AccountEditor from './components/AccountEditor';
import Initializer from './components/Initializer';
import Login from './components/Login';
import NewScheduleDialog from './components/NewScheduleDialog';
import ReportForm from './components/ReportForm';
import RequirementPane from './components/RequirementPane';
import ScheduleTab from './components/ScheduleTab';
import SemesterPane from './components/SemesterPane';

import './App.css';

type AppProps = {};

// TODO loggedIn state can be derived from user state.

type AppState = {
  loggedIn: boolean;
  user: Account | null;
  userData: UserData | null;
  activeSchedule: string;
  modal: 'login' | 'initializer' | 'new-schedule' | 'account-editor' | 'report-form' | null;
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      loggedIn: false,
      user: null,
      userData: null,
      activeSchedule: 'Schedule 1',
      modal: null,
    };
  }

  componentDidMount(): void {
    this.fetchInitialData();
    this.prefetchData();
    this.registerSavePrompt();
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState): void {
    /* Save user data to server if we are logged in, the current user data is
     * non-null, the previous user data was not null (which means it was just
     * loaded), and the data has changed. */
    if (
      this.state.loggedIn &&
      this.state.userData &&
      prevState.userData !== null &&
      prevState.userData !== this.state.userData
    ) {
      User.saveUserData(this.state.userData);
    }
  }

  private fetchInitialData = async (): Promise<void> => {
    const res = await User.whoami();

    this.setState({
      loggedIn: res.loggedIn,
    });

    if (res.loggedIn) {
      this.setState({
        user: res.user,
      });

      /* Fetch user data. */
      const userData = await this.fetchUserData();

      /* If there are no schedules, open the initializer. */
      if (Object.keys(userData.schedules).length === 0) {
        this.openInitializer();
      }
    } else {
      /* Initialize anonymous user with empty user data. */
      this.setState({
        userData: User.EMPTY_USER_DATA,
      });

      this.openLogin();
    }
  };

  private prefetchData = async (): Promise<void> => {
    Courses.getCourses();
    Requirements.getRequirements();
    Tags.getTags();
  };

  private registerSavePrompt = (): void => {
    window.addEventListener('beforeunload', (e) => {
      if (!this.state.loggedIn && this.state.userData && Object.keys(this.state.userData.schedules).length > 0) {
        /* This text isn't actually what is displayed. */
        const confirmation = 'Are you sure you want to leave? Guest account changes will be lost.';
        e.returnValue = confirmation;
        e.preventDefault();
        return confirmation;
      }
      return undefined;
    });
  };

  closeModal = (): void => {
    this.setState({
      modal: null,
    });
  };

  openLogin = (): void => {
    this.setState({
      modal: 'login',
    });
  };

  handleLogin = async (username: string, password: string): Promise<string | null> => {
    const err = await this.login(username, password);

    if (err) {
      return err;
    }

    const userData = await this.fetchUserData();

    if (Object.keys(userData.schedules).length === 0) {
      this.openInitializer();
    } else {
      this.closeModal();
    }

    return null;
  };

  handleRegister = async (username: string, password: string, userTesting: boolean): Promise<string | null> => {
    const err = await this.register(username, password, userTesting);

    if (err) {
      return err;
    }

    if (!this.state.userData || Object.keys(this.state.userData.schedules).length === 0) {
      this.openInitializer();
    } else {
      User.saveUserData(this.state.userData);
      this.closeModal();
    }

    return null;
  };

  handleLoginDismiss = (): void => {
    if (this.state.userData && Object.keys(this.state.userData.schedules).length === 0) {
      this.openInitializer();
    } else {
      this.closeModal();
    }
  };

  openInitializer = (): void => {
    this.setState({
      modal: 'initializer',
    });
  };

  handleInitializeSchedule = (schedule: Schedule): void => {
    this.setSchedule(this.state.activeSchedule, schedule);
    this.closeModal();
  };

  handleNewSchedule = (name: string, createFrom: string | null): void => {
    if (!this.state.userData) {
      throw new Error('Tried to add new schedule before user data loaded');
    }

    if (createFrom === null) {
      this.setSchedule(name, Schedule.EMPTY_SCHEDULE);
    } else {
      if (!this.state.userData.schedules[createFrom]) {
        throw new Error('Tried to add new schedule from non-existent schedule');
      }
      this.setSchedule(name, this.state.userData.schedules[createFrom]);
    }
    this.closeModal();
    this.setActiveSchedule(name);
  };

  openAccountEditor = (): void => {
    this.setState({
      modal: 'account-editor',
    });
  };

  openReportForm = (): void => {
    this.setState({
      modal: 'report-form',
    });
  };

  setActiveSchedule = (scheduleName: string): void => {
    if (!this.state.userData) {
      throw new Error('Tried to set active schedule before user data loaded');
    }

    this.setState({
      activeSchedule: scheduleName,
    });

    /* If the active schedule is empty or nonexistent, open the initializer. */
    if (
      !Object.keys(this.state.userData.schedules).includes(scheduleName) ||
      Object.keys(this.state.userData.schedules[scheduleName]?.semesters)?.length === 0
    ) {
      this.openInitializer();
    }
  };

  handleSelectGoals = (goals: RequirementSet[]) => {
    this.setGoals(goals);
    this.closeModal();
  };

  register = async (username: string, password: string, userTesting: boolean): Promise<string | null> => {
    if (this.state.loggedIn) {
      throw new Error('Tried to register when already logged in');
    }

    const res = await User.register(username, password, userTesting);
    if (res.success) {
      this.setState({
        ...this.state,
        loggedIn: true,
        user: res.user,
      });
    }
    return res.success ? null : res.error;
  };

  login = async (username: string, password: string): Promise<string | null> => {
    if (this.state.loggedIn) {
      throw new Error('Tried to log in when already logged in');
    }

    const res = await User.login(username, password);
    if (res.success) {
      this.setState({
        ...this.state,
        loggedIn: true,
        user: res.user,
      });
    }
    return res.success ? null : res.error;
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

  queryWhoami = async (): Promise<string | null> => {
    const res = await User.whoami();
    if (res.loggedIn) {
      this.setState({
        loggedIn: true,
        user: res.user,
      });
    } else {
      this.setState({
        loggedIn: false,
        user: null,
      });
    }
    return res.loggedIn ? res.user.username : null;
  };

  fetchUserData = async (): Promise<UserData> => {
    /* Set user data to null while loading. */
    this.setState({
      userData: null,
    });

    /* Fetch user data. */
    const userData = await User.fetchUserData();

    /* Update user data with new data. */
    this.setState({
      userData,
    });

    /* Set the active schedule to the first one, if it exists. */
    if (Object.keys(userData.schedules).length > 0) {
      this.setActiveSchedule(Object.keys(userData.schedules)[0]);
    }

    return userData;
  };

  /**
   * Updates the list of goals to a new list of given goals.
   *
   * @param {RequirementSet[]} newGoals The new goals.
   */
  setGoals = (newGoals: RequirementSet[]): void => {
    if (!this.state.userData) {
      throw new Error('Tried to set goals before user data loaded');
    }

    const schedule = this.state.userData.schedules[this.state.activeSchedule];

    if (!schedule) {
      throw new Error('Tried to set goals on non-existent schedule');
    }

    this.setState({
      userData: {
        ...this.state.userData,
        schedules: {
          ...this.state.userData.schedules,
          [this.state.activeSchedule]: {
            ...schedule,
            goals: [...newGoals],
          },
        },
      },
    });
  };

  /**
   * Updates the list of semesters to a new mapping of given semesters.
   *
   * @param {Map<string, Semester[]>} newSemesters The new semesters.
   */
  setSemesters = (newSemesters: { [name: string]: (Semester | null)[] }): void => {
    if (!this.state.userData) {
      throw new Error('Tried to set semesters before user data loaded');
    }

    const schedule = this.state.userData.schedules[this.state.activeSchedule];

    if (!schedule) {
      throw new Error('Tried to set goals on non-existent schedule');
    }

    this.setState({
      userData: {
        ...this.state.userData,
        schedules: {
          ...this.state.userData.schedules,
          [this.state.activeSchedule]: {
            ...schedule,
            semesters: newSemesters,
          },
        },
      },
    });
  };

  /**
   * Adds a course to a given semester.
   *
   * @param {Semester} semester The semester to which to add the course.
   * @param {Course} course The course to add.
   */
  addCourse = (semester: Semester, course: Course): void => {
    if (!this.state.userData) {
      throw new Error('Tried to add course before user data loaded');
    }

    if (semester.courses.includes(course)) {
      throw new Error(`Tried to add course ${course.id} to semester ${semester.name}, which it already has`);
    }

    const schedule = this.state.userData.schedules[this.state.activeSchedule];

    if (!schedule) {
      throw new Error('Tried to set goals on non-existent schedule');
    }

    const year = Object.keys(schedule.semesters).find((y) => schedule.semesters[y].includes(semester));

    if (year === undefined) {
      throw new Error("Tried to add a course to a semester which doesn't exist");
    }

    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        schedules: {
          ...this.state.userData.schedules,
          [this.state.activeSchedule]: {
            ...schedule,
            semesters: {
              ...schedule.semesters,
              [year]: schedule.semesters[year].map((s) =>
                s !== semester
                  ? s
                  : {
                      ...semester,
                      courses: [...semester.courses, course],
                    },
              ),
            },
          },
        },
      },
    });
  };

  /**
   * Removes a course from a given semester.
   *
   * @param {Semester} semester The semester from which to remove the course.
   * @param {Course} course The course to remove.
   */
  removeCourse = (semester: Semester, course: Course): void => {
    if (!this.state.userData) {
      throw new Error('Tried to remove course before user data loaded');
    }

    if (!semester.courses.includes(course)) {
      throw new Error(`Tried to remove course ${course.id} from semester ${semester.name}, which it doesn't have`);
    }

    const schedule = this.state.userData.schedules[this.state.activeSchedule];

    if (!schedule) {
      throw new Error('Tried to set goals on non-existent schedule');
    }

    const year = Object.keys(schedule.semesters).find((y) => schedule.semesters[y].includes(semester));

    if (year === undefined) {
      throw new Error("Tried to remove a course to a semester which doesn't exist");
    }

    semester.courses = [...semester.courses, course];
    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        schedules: {
          ...this.state.userData.schedules,
          [this.state.activeSchedule]: {
            ...schedule,
            semesters: {
              ...schedule.semesters,
              [year]: schedule.semesters[year].map((s) =>
                s !== semester
                  ? s
                  : {
                      ...semester,
                      courses: semester.courses.filter((c) => c !== course),
                    },
              ),
            },
          },
        },
      },
    });
  };

  manuallyFulfill = (requirement: Requirement, requirementSet: RequirementSet): void => {
    if (!this.state.userData) {
      throw new Error('Tried to manually fulfill before user data loaded');
    }

    const schedule = this.state.userData.schedules[this.state.activeSchedule];

    if (!schedule) {
      throw new Error('Tried to set goals on non-existent schedule');
    }

    if (schedule.manuallyFulfilledReqs[requirementSet.id].includes(requirementSet.id)) {
      throw new Error(
        `Tried to mark fulfilled requirement ${requirement.id} from set ${requirementSet.id}, which it already is`,
      );
    }

    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        schedules: {
          ...this.state.userData.schedules,
          [this.state.activeSchedule]: {
            ...schedule,
            manuallyFulfilledReqs: {
              ...schedule.manuallyFulfilledReqs,
              [requirementSet.id]: [...schedule.manuallyFulfilledReqs[requirementSet.id], requirement.id],
            },
          },
        },
      },
    });
  };

  manuallyUnfulfill = (requirement: Requirement, requirementSet: RequirementSet): void => {
    if (!this.state.userData) {
      throw new Error('Tried to manually unfulfill before user data loaded');
    }

    const schedule = this.state.userData.schedules[this.state.activeSchedule];

    if (!schedule) {
      throw new Error('Tried to set goals on non-existent schedule');
    }

    if (!schedule.manuallyFulfilledReqs[requirementSet.id]?.includes(requirement.id)) {
      throw new Error(
        `Tried to unmark fulfilled requirement ${requirement.id} from set ${requirementSet.id}, which it already isn't`,
      );
    }

    const nextArr = schedule.manuallyFulfilledReqs[requirementSet.id].filter((reqId) => reqId !== requirement.id);

    const nextObj = Object.fromEntries(
      Object.entries(schedule.manuallyFulfilledReqs).filter(([reqSetId, reqSets]) => reqSetId !== requirementSet.id),
    );
    if (nextArr.length > 0) {
      nextObj[requirementSet.id] = nextArr;
    }

    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        schedules: {
          ...this.state.userData.schedules,
          [this.state.activeSchedule]: {
            ...schedule,
            manuallyFulfilledReqs: nextObj,
          },
        },
      },
    });
  };

  setSchedule = (name: string, schedule: Schedule): void => {
    if (!this.state.userData) {
      throw new Error('Tried to set schedule before user data loaded');
    }

    this.setState({
      userData: {
        ...this.state.userData,
        schedules: {
          ...this.state.userData.schedules,
          [name]: schedule,
        },
      },
    });
  };

  deleteSchedule = (name: string): void => {
    if (!this.state.userData) {
      throw new Error('Tried to delete schedule before user data loaded');
    }

    if (!Object.keys(this.state.userData.schedules).includes(name)) {
      throw new Error('Tried to delete non-existent schedule');
    }

    this.setState((oldState) => {
      const nextSchedules = { ...oldState.userData!.schedules };
      delete nextSchedules[name];

      return {
        userData: {
          ...oldState.userData,
          schedules: nextSchedules,
        },
      };
    });

    if (this.state.activeSchedule === name) {
      this.setActiveSchedule(Object.keys(this.state.userData.schedules)[0]);
    }
  };

  renameSchedule = (oldName: string, newName: string): void => {
    if (!this.state.userData) {
      throw new Error('Tried to rename schedule before user data loaded');
    }

    if (Object.keys(!this.state.userData.schedules).includes(oldName)) {
      throw new Error('Tried to rename non-existent schedule');
    }

    this.setSchedule(newName, this.state.userData.schedules[oldName]);
    this.deleteSchedule(oldName);
    if (this.state.activeSchedule === oldName) {
      this.setActiveSchedule(newName);
    }
  };

  /**
   * Gets a list of all the courses a user is currently taking, in the form of
   * an array, based on the currrent state and userdata.
   *
   * @return {Course[]} A list of courses that are in the state.
   */
  private getCurrentCourses = (): Course[] => {
    if (!this.state.userData) {
      throw new Error('Tried to get current courses before user data loaded');
    }

    const schedule = this.state.userData.schedules[this.state.activeSchedule];

    if (!schedule) {
      throw new Error('Tried to set goals on non-existent schedule');
    }

    return Object.values(schedule.semesters)
      .flat()
      .filter((semester) => semester)
      .flatMap((semester) => semester!.courses);
  };

  private renderScheduleTabs = (): React.ReactNode => {
    if (!this.state.userData?.schedules) {
      return null;
    }

    const tabs = Object.entries(this.state.userData.schedules).map(([scheduleName, schedule]) => (
      <React.Fragment key={scheduleName}>
        <ScheduleTab
          scheduleName={scheduleName}
          active={scheduleName === this.state.activeSchedule}
          onSetActive={() => this.setActiveSchedule(scheduleName)}
          onRename={(newName) => this.renameSchedule(scheduleName, newName)}
          onDelete={() => this.deleteSchedule(scheduleName)}
        />
        <span> | </span>
      </React.Fragment>
    ));
    tabs.push(
      <button key="" className="gt-button" type="button" onClick={() => this.setState({ modal: 'new-schedule' })}>
        + Add
      </button>,
    );
    return tabs;
  };

  private renderName = (): React.ReactNode => {
    if (this.state.loggedIn && this.state.user) {
      return (
        <div className="App__name">
          <div className="App__left">{this.renderScheduleTabs()}</div>
          <div className="App__right">
            <button className="gt-button" type="button" onClick={this.openAccountEditor}>
              {this.state.user.username}
            </button>
            <span> | </span>
            <button className="gt-button" type="button" onClick={this.logout}>
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
            <i className="material-icons App__report" onClick={this.openReportForm}>
              flag
            </i>
          </div>
        </div>
      );
    } else {
      /* Not logged in. */
      return (
        <div className="App__name">
          <div className="App__left">{this.renderScheduleTabs()}</div>
          <div className="App__right">
            <button className="gt-button" type="button" onClick={this.openLogin}>
              Guest User
            </button>
            <span> | </span>
            <button className="gt-button" type="button" onClick={this.openLogin}>
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
            <i className="material-icons App__report" onClick={this.openReportForm}>
              flag
            </i>
          </div>
        </div>
      );
    }
  };

  private renderBody(): React.ReactNode {
    if (!this.state.userData) {
      return <div>Loading...</div>;
    }

    const schedule = this.state.userData.schedules[this.state.activeSchedule];

    if (!schedule) {
      return null;
    }

    return (
      <Row className="App__main" noGutters>
        <Col xs={8}>
          <SemesterPane
            semesters={schedule.semesters}
            onAddCourse={this.addCourse}
            onRemoveCourse={this.removeCourse}
            onChangeSemesters={this.setSemesters}
          />
        </Col>
        <Col xs={4}>
          <RequirementPane
            courses={this.getCurrentCourses()}
            goals={schedule.goals}
            manuallyFulfilled={schedule.manuallyFulfilledReqs}
            onManualFulfill={this.manuallyFulfill}
            onManualUnfulfill={this.manuallyUnfulfill}
            onChangeGoals={this.setGoals}
          />
        </Col>
      </Row>
    );
  }

  private renderModals(): React.ReactNode {
    if (!this.state.userData) {
      return null;
    }

    return (
      <>
        <Modal backdrop="static" show={this.state.modal === 'login'}>
          <Modal.Body>
            <Login onLogin={this.handleLogin} onRegister={this.handleRegister} onDismiss={this.handleLoginDismiss} />
          </Modal.Body>
        </Modal>
        <Modal size="lg" backdrop="static" show={this.state.modal === 'initializer'} onHide={this.closeModal}>
          <Modal.Body>
            <Initializer onInitialize={this.handleInitializeSchedule} />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.modal === 'new-schedule'} onHide={this.closeModal}>
          <Modal.Body>
            <NewScheduleDialog
              existingScheduleNames={Object.keys(this.state.userData.schedules)}
              onCreate={this.handleNewSchedule}
            />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.modal === 'account-editor'} onHide={this.closeModal}>
          <Modal.Body>
            {this.state.user ? <AccountEditor user={this.state.user} onClose={this.closeModal} /> : null}
          </Modal.Body>
        </Modal>
        <Modal show={this.state.modal === 'report-form'} onHide={this.closeModal}>
          <Modal.Body>
            <ReportForm />
          </Modal.Body>
        </Modal>
      </>
    );
  }

  render(): React.ReactElement {
    return (
      <div className="App">
        <header className="App__header">
          <div className="App__title">
            <a className="App__title-link" href="https://gradtrak.me/">
              GradTrak<sup className="App__beta">BETA</sup>
            </a>
          </div>
          {this.renderName()}
        </header>
        <main className="App__body">{this.renderBody()}</main>
        {this.renderModals()}
      </div>
    );
  }
}

export default App;
