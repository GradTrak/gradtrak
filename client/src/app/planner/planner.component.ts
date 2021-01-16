import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from './models/course.model';
import { Requirement } from './models/requirement.model';
import { RequirementSet } from './models/requirement-set.model';
import { Semester } from './models/semester.model';
import { State } from './models/state.model';
import { UserData } from './models/user-data.model';
import { CourseService } from './services/course.service';
import { RequirementService } from './services/requirement.service';
import { TagService } from './services/tag.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss'],
})
export class PlannerComponent implements OnInit {
  state: State;
  currentCourses: Course[];
  isLoading: boolean;

  courseAdderSemester: Semester;
  displayedRequirement: Requirement;
  berkeleytimeCourse: Course;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @ViewChild('login', { static: true }) private loginTemplate: TemplateRef<any>;
  @ViewChild('initializer', { static: true }) private initializerTemplate: TemplateRef<any>;
  @ViewChild('reportForm', { static: true }) private reportFormTemplate: TemplateRef<any>;
  @ViewChild('accountEditor', { static: true }) private accountEditorTemplate: TemplateRef<any>;
  @ViewChild('goalSelector', { static: false }) private goalSelectorTemplate: TemplateRef<any>;
  @ViewChild('semesterChanger', { static: false }) private semesterChangerTemplate: TemplateRef<any>;
  @ViewChild('courseAdder', { static: false }) private courseAdderTemplate: TemplateRef<any>;
  @ViewChild('requirementDisplay', { static: false }) private requirementDisplayTemplate: TemplateRef<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private modalInstance: NgbModalRef;

  private loginPrompted: boolean;

  constructor(
    private courseService: CourseService,
    private requirementService: RequirementService,
    private tagService: TagService,
    private userService: UserService,
    private modalService: NgbModal,
  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.userService.getState().subscribe((nextState: State) => {
      if (nextState !== UserService.INITIAL_STATE) {
        const wasLoading: boolean = this.isLoading;
        this.isLoading = false;

        if (nextState.loggedIn && !this.state.loggedIn) {
          /* Fetch user data if just logged in */
          this.userService.fetchUserData();
          this.isLoading = true;
        } else if (!nextState.loggedIn && !this.loginPrompted) {
          /* Open login modal if not opened previously */
          this.loginPrompted = true;
          this.openLogin();
        } else if (nextState.userData.semesters.size === 0) {
          /* Open initializer if not prompting for login and empty semesters */
          this.openInitializer();
        }

        /* Save user data if logged in, not just loaded, and user data changed */
        if (!wasLoading && nextState.loggedIn && this.state.userData !== nextState.userData) {
          this.userService.saveUserData();
        }
      }
      this.state = nextState;
      this.currentCourses = this.getCurrentCourses();
    });
    this.userService.queryWhoami().subscribe();

    /* Prefetch data */
    this.courseService.getCourses().subscribe();
    this.requirementService.getRequirements().subscribe();
    this.tagService.getTags().subscribe();

    /* Register beforeclose handler for save prompt */
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
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.close();
      this.modalInstance = null;
    }
  }

  openLogin(): void {
    this.closeModal();
    this.modalInstance = this.modalService.open(this.loginTemplate, { backdrop: 'static', keyboard: false });
  }

  onLoginDismiss(): void {
    this.closeModal();
    if (this.state.userData.semesters.size === 0) {
      this.openInitializer();
    }
  }

  openInitializer(): void {
    this.closeModal();
    this.modalInstance = this.modalService.open(this.initializerTemplate, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  openAccountEditor(): void {
    this.closeModal();
    this.modalInstance = this.modalService.open(this.accountEditorTemplate);
  }

  openReportForm(): void {
    this.closeModal();
    this.modalInstance = this.modalService.open(this.reportFormTemplate);
  }

  openGoalSelector(): void {
    this.closeModal();
    this.modalInstance = this.modalService.open(this.goalSelectorTemplate, { size: 'lg' });
  }

  openSemesterChanger(): void {
    this.closeModal();
    this.modalInstance = this.modalService.open(this.semesterChangerTemplate, { size: 'lg' });
  }

  openCourseAdder(semester: Semester): void {
    this.closeModal();
    this.courseAdderSemester = semester;
    this.modalInstance = this.modalService.open(this.courseAdderTemplate, { size: 'lg' });
  }

  openRequirementDisplay(displayedRequirement: Requirement): void {
    this.closeModal();
    this.displayedRequirement = displayedRequirement;
    this.modalInstance = this.modalService.open(this.requirementDisplayTemplate, { size: 'lg' });
  }

  logout(): void {
    this.userService.logout();
  }

  setGoals(goals: RequirementSet[]): void {
    this.userService.updateGoals(goals);
  }

  setSemesters(semestersOutput: Map<string, Semester[]>): void {
    this.userService.updateSemesters(semestersOutput);
  }

  addCourse(course: Course): void {
    this.userService.addCourse(course, this.courseAdderSemester);
  }

  setUserData(userData: UserData): void {
    this.userService.setUserData(userData);
  }

  /**
   * Gets a list of all the courses a user is currently taking, in
   * the form of an array, based on the currrent state and userdata.
   * @return a list of courses that are in the state.
   */
  private getCurrentCourses(): Course[] {
    return Array.from(this.state.userData.semesters.values())
      .flat()
      .filter((semester: Semester) => semester)
      .flatMap((semester: Semester) => semester.courses);
  }
}
