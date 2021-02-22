import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';

import { Course } from './models/course.model';
import { Requirement } from './models/requirement.model';
import { RequirementSet } from './models/requirement-set.model';
import { Semester } from './models/semester.model';
import { UserData } from './models/user-data.model';
import Courses from './lib/courses';
import Requirements from './lib/requirements';
import Tags from './lib/tags';
import User, { Account } from './lib/user';

import AccountEditor from './components/AccountEditor';
import Initializer from './components/Initializer';
import Login from './components/Login';
import ReportForm from './components/ReportForm';
import RequirementPane from './components/RequirementPane';
import SemesterPane from './components/SemesterPane';

import './App.css';

type AppProps = {};

// TODO loggedIn state can be derived from user state.

type AppState = {
  loggedIn: boolean;
  user: Account | null;
  userData: UserData | null;
  modal: 'login' | 'initializer' | 'account-editor' | 'report-form' | null;
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      loggedIn: false,
      user: null,
      userData: null,
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

      /* If there are no semesters, open the initializer. */
      if (userData.semesters.size === 0) {
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
      if (!this.state.loggedIn && this.state.userData && this.state.userData.semesters.size > 0) {
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

    if (userData.semesters.size === 0) {
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

    if (this.state.userData && this.state.userData.semesters.size === 0) {
      User.saveUserData(this.state.userData);
    } else {
      this.openInitializer();
    }

    return null;
  };

  handleLoginDismiss = (): void => {
    if (this.state.userData && this.state.userData.semesters.size === 0) {
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

  handleInitializeData = (userData: UserData): void => {
    this.setUserData(userData);
    this.closeModal();
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
        user: res.user || null,
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
        user: res.user || null,
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
        user: res.user || null,
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
    this.setState({
      userData: null,
    });
    const userData = await User.fetchUserData();
    this.setState({
      userData,
    });
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

    this.setState({
      userData: {
        ...this.state.userData,
        goals: [...newGoals],
      },
    });
  };

  /**
   * Updates the list of semesters to a new mapping of given semesters.
   *
   * @param {Map<string, Semester[]>} newSemesters The new semesters.
   */
  setSemesters = (newSemesters: Map<string, (Semester | null)[]>): void => {
    if (!this.state.userData) {
      throw new Error('Tried to set semesters before user data loaded');
    }

    // not sure why, before the rework the list of semesters was copied, so
    // I've copied the map here as well.
    const newMap = new Map<string, (Semester | null)[]>();
    newSemesters.forEach((value, key) => {
      newMap.set(key, [...value]);
    });
    this.setState({
      userData: {
        ...this.state.userData,
        semesters: newMap,
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

    // TODO Making this a function that returns a clone breaks the
    // course-changer
    semester.courses = [...semester.courses, course];
    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        semesters: new Map<string, (Semester | null)[]>(this.state.userData.semesters),
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

    // TODO Making this a function that returns a clone breaks the course-changer
    semester.courses = semester.courses.filter((c) => c !== course);
    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        semesters: new Map<string, (Semester | null)[]>(this.state.userData.semesters),
      },
    });
  };

  manuallyFulfill = (requirement: Requirement, requirementSet: RequirementSet): void => {
    if (!this.state.userData) {
      throw new Error('Tried to manually fulfill before user data loaded');
    }

    const { manuallyFulfilledReqs } = this.state.userData;

    if (manuallyFulfilledReqs.get(requirementSet.id)?.has(requirement.id)) {
      throw new Error(
        `Tried to mark fulfilled requirement ${requirement.id} from set ${requirementSet.id}, which it already is`,
      );
    }

    const nextSet = new Set<string>(manuallyFulfilledReqs.get(requirementSet.id));
    nextSet.add(requirement.id);

    const nextManuallyFulfilled = new Map<string, Set<string>>(manuallyFulfilledReqs);
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
    if (!this.state.userData) {
      throw new Error('Tried to manually unfulfill before user data loaded');
    }

    const { manuallyFulfilledReqs } = this.state.userData;

    if (!manuallyFulfilledReqs.get(requirementSet.id)?.has(requirement.id)) {
      throw new Error(
        `Tried to unmark fulfilled requirement ${requirement.id} from set ${requirementSet.id}, which it already isn't`,
      );
    }

    const nextManuallyFulfilled = new Map<string, Set<string>>(manuallyFulfilledReqs);
    const nextSet = new Set<string>(manuallyFulfilledReqs.get(requirementSet.id));
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
    if (!this.state.userData) {
      throw new Error('Tried to get current courses before user data loaded');
    }

    return Array.from(this.state.userData.semesters.values())
      .flat()
      .filter((semester) => semester)
      .flatMap((semester) => semester!.courses);
  };

  private renderName = (): React.ReactNode => {
    if (this.state.loggedIn && this.state.user) {
      return (
        <div className="App__name">
          <div className="App__left">Name: {this.state.user.username}</div>
          <div className="App__right">
            <button className="gt-button" type="button" onClick={this.openAccountEditor}>
              Account
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
          <div className="App__left">Guest User</div>
          <div className="App__right">
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

    return (
      <Row className="App__main" noGutters>
        <Col xs={8}>
          <SemesterPane
            semesters={this.state.userData.semesters}
            onAddCourse={this.addCourse}
            onRemoveCourse={this.removeCourse}
            onChangeSemesters={this.setSemesters}
          />
        </Col>
        <Col xs={4}>
          <RequirementPane
            courses={this.getCurrentCourses()}
            goals={this.state.userData.goals}
            manuallyFulfilled={this.state.userData.manuallyFulfilledReqs}
            onManualFulfill={this.manuallyFulfill}
            onManualUnfulfill={this.manuallyUnfulfill}
            onChangeGoals={this.setGoals}
          />
        </Col>
      </Row>
    );
  }

  private renderModals(): React.ReactNode {
    if (this.state.userData) {
      return (
        <>
          <Modal backdrop="static" show={this.state.modal === 'login'}>
            <Modal.Body>
              <Login onLogin={this.handleLogin} onRegister={this.handleRegister} onDismiss={this.handleLoginDismiss} />
            </Modal.Body>
          </Modal>
          <Modal size="lg" backdrop="static" show={this.state.modal === 'initializer'} onHide={this.closeModal}>
            <Modal.Body>
              <Initializer onInitializeData={this.handleInitializeData} />
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
    } else {
      return null;
    }
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
