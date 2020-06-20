import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from './models/course.model';
import { Semester } from './models/semester.model';
import { State } from './models/state.model';
import { UserData } from './models/user-data.model';
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @ViewChild('login', { static: true }) private loginTemplate: TemplateRef<any>;
  @ViewChild('initializer', { static: true }) private initializerTemplate: TemplateRef<any>;
  @ViewChild('reportForm', { static: true }) private reportFormTemplate: TemplateRef<any>;
  @ViewChild('accountEditor', { static: true }) private accountEditorTemplate: TemplateRef<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private modalInstance: NgbModalRef;

  private loginPrompted: boolean;

  constructor(private userService: UserService, private modalService: NgbModal) {
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

  logout(): void {
    this.userService.logout();
  }

  setUserData(userData: UserData): void {
    this.closeModal();
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
