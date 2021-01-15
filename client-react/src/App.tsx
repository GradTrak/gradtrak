import React from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';

import { Course } from './models/course.model';
import { Requirement } from './models/requirement.model';
import { RequirementSet } from './models/requirement-set.model';
import { Semester } from './models/semester.model';
import { StandaloneRequirement } from './models/requirements/standalone-requirement.model';
import { UserData } from './models/user-data.model';
import Courses from './lib/courses';
import Requirements from './lib/requirements';
import Tags from './lib/tags';
import User, { Account } from './lib/user';

import AccountEditor from './components/AccountEditor';
import CourseSearcher from './components/CourseSearcher';
import GoalSelector from './components/GoalSelector';
import Initializer from './components/Initializer';
import Login from './components/Login';
import ReportForm from './components/ReportForm';
import RequirementDisplay from './components/RequirementDisplay';
import RequirementPane from './components/RequirementPane';
import SemesterChanger from './components/SemesterChanger';
import SemesterPane from './components/SemesterPane';

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
  user: Account;
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

  componentDidMount(): void {
    this.fetchInitialData();
    this.prefetchData();
    this.registerSavePrompt();
  }

  private fetchInitialData = async (): Promise<void> => {
    const res = await User.whoami();

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
      this.openLogin();
    }

    this.setState({
      isLoading: false,
    });
  };

  private prefetchData = async (): Promise<void> => {
    Courses.getCourses();
    Requirements.getRequirements();
    Tags.getTags();
  };

  private registerSavePrompt = (): void => {
    window.addEventListener('beforeunload', (e) => {
      if (!this.state.loggedIn && this.state.userData.semesters.size > 0) {
        /* This text isn't actually what is displayed. */
        const confirmation: string = 'Are you sure you want to leave? Guest account changes will be lost.';
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
      modal: {
        type: 'login',
      },
    });
  };

  handleLogin = async (username: string, password: string): Promise<string> => {
    const err = await this.login(username, password);

    if (!err) {
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

  handleRegister = async (username: string, password: string, userTesting: boolean): Promise<string> => {
    const err = await this.register(username, password, userTesting);
    if (!err) {
      return err;
    }
    this.closeModal();
    return null;
  };

  handleLoginDismiss = (): void => {
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

  handleSelectGoals = (goals: RequirementSet[]) => {
    this.setGoals(goals);
    this.closeModal();
  };

  openSemesterChanger = (): void => {
    this.setState({
      modal: {
        type: 'semester-changer',
      },
    });
  };

  handleChangeSemester = (semesters: Map<string, Semester[]>) => {
    this.setSemesters(semesters);
    this.closeModal();
  };

  openCourseAdder = (semester: Semester): void => {
    this.setState({
      modal: {
        type: 'course-adder',
        semester,
      },
    });
  };

  handleAddCourse = (course: Course): void => {
    if (this.state.modal?.type !== 'course-adder') {
      throw new Error('Course adder tried to add course while closed');
    }
    this.addCourse(course, this.state.modal.semester);
  };

  openRequirementDisplay = (requirement: StandaloneRequirement): void => {
    this.setState({
      modal: {
        type: 'requirement-display',
        requirement,
      },
    });
  };

  register = async (username: string, password: string, userTesting: boolean): Promise<string> => {
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
    return res.error || null;
  };

  login = async (username: string, password: string): Promise<string> => {
    if (this.state.loggedIn) {
      throw new Error('Tried to register when already logged in');
    }

    const res = await User.login(username, password);
    if (res.success) {
      this.setState({
        ...this.state,
        loggedIn: true,
        user: res.user,
      });
    }
    return res.error || null;
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
    const userData = await User.fetchUserData();
    if (userData.semesters.size > 0) {
      this.setState({
        userData,
      });
    }
    return userData;
  };

  /**
   * Updates the list of goals to a new list of given goals.
   *
   * @param {RequirementSet[]} newGoals The new goals.
   */
  setGoals = (newGoals: RequirementSet[]): void => {
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
  setSemesters = (newSemesters: Map<string, Semester[]>): void => {
    // not sure why, before the rework the list of semesters was copied, so
    // I've copied the map here as well.
    const newMap = new Map<string, Semester[]>();
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
   * @param {Semester} semester The semester from which to remove the course.
   * @param {Course} course The course to remove.
   */
  removeCourse = (semester: Semester, course: Course): void => {
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
        <Container>
          <Row className="main" noGutters>
            <Col xs={8}>
              <SemesterPane
                semesters={this.state.userData.semesters}
                onOpenSemesterChanger={this.openSemesterChanger}
                onOpenCourseAdder={this.openCourseAdder}
                onRemoveCourse={this.removeCourse}
              />
            </Col>
            <Col xs={4}>
              <RequirementPane
                courses={this.getCurrentCourses()}
                goals={this.state.userData.goals}
                manuallyFulfilled={this.state.userData.manuallyFulfilledReqs}
                onOpenGoalSelector={this.openGoalSelector}
                onOpenRequirementDisplay={this.openRequirementDisplay}
                onManualFulfill={this.manuallyFulfill}
                onManualUnfulfill={this.manuallyUnfulfill}
              />
            </Col>
          </Row>
        </Container>
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
        <Modal show={this.state.modal?.type === 'login'}>
          <Modal.Body>
            <Login onLogin={this.handleLogin} onRegister={this.handleRegister} onDismiss={this.handleLoginDismiss} />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.modal?.type === 'initializer'}>
          <Modal.Body>
            <Initializer onInitializeData={this.setUserData} />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.modal?.type === 'account-editor'}>
          <Modal.Body>
            <AccountEditor onClose={this.closeModal} />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.modal?.type === 'report-form'}>
          <Modal.Body>
            <ReportForm />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.modal?.type === 'goal-selector'}>
          <Modal.Body>
            <GoalSelector initialGoals={this.state.userData.goals} onSelectGoals={this.handleSelectGoals} />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.modal?.type === 'semester-changer'}>
          <Modal.Body>
            <SemesterChanger
              initialSemesters={this.state.userData.semesters}
              onChangeSemesters={this.handleChangeSemester}
            />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.modal?.type === 'course-adder'}>
          <Modal.Header>
            <Modal.Title>
              Add a class to {this.state.modal?.type === 'course-adder' && this.state.modal.semester.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CourseSearcher onSelectCourse={this.handleAddCourse} />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.modal?.type === 'requirement-display'}>
          <Modal.Body>
            <RequirementDisplay
              requirement={this.state.modal?.type === 'requirement-display' && this.state.modal.requirement}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default App;
