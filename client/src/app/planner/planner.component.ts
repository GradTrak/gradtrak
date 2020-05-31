import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from './models/course.model';
import { Semester } from './models/semester.model';
import { State } from './models/state.model';
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

  private loginInstance: NgbModalRef;
  private initializerInstance: NgbModalRef;
  private accountEditorInstance: NgbModalRef;

  private loginPrompted: boolean;

  constructor(private userService: UserService, private modalService: NgbModal) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.userService.getState().subscribe((nextState: State) => {
      if (nextState !== UserService.INITIAL_STATE) {
        const wasLoading: boolean = this.isLoading;
        this.isLoading = false;

        /* Fetch user data if just logged in */
        if (nextState.loggedIn && !this.state.loggedIn) {
          this.userService.fetchUserData();
          this.isLoading = true;
        }

        /* Open login modal if not opened previously */
        if (!nextState.loggedIn && !this.loginPrompted) {
          this.loginPrompted = true;
          this.openLogin();
        }

        /* Save user data if logged in and not just loaded */
        if (!wasLoading && nextState.loggedIn) {
          this.userService.saveUserData();
        }

        /* Open initializer if not prompting for login and empty semesters */
        if (!this.loginInstance && nextState.userData.semesters.length === 0) {
          this.openInitializer();
        }
      }
      this.state = nextState;
      this.currentCourses = this.getCurrentCourses();
    });
    this.userService.queryWhoami().subscribe();
  }

  openLogin(): void {
    this.loginInstance = this.modalService.open(this.loginTemplate);
  }

  closeLogin(): void {
    if (this.loginInstance) {
      this.loginInstance.close();
    }
  }

  openInitializer(): void {
    this.initializerInstance = this.modalService.open(this.initializerTemplate);
  }

  closeInitializer(): void {
    if (this.initializerInstance) {
      this.initializerInstance.close();
    }
  }

  openAccountEditor(): void {
    this.accountEditorInstance = this.modalService.open(this.accountEditorTemplate);
  }

  closeAccountEditor(): void {
    if (this.accountEditorInstance) {
      this.accountEditorInstance.close();
    }
  }

  openReportForm(): void {
    this.modalService.open(this.reportFormTemplate);
  }

  logout(): void {
    this.userService.logout();
  }

  private getCurrentCourses(): Course[] {
    return this.state.userData.semesters.flatMap((semester: Semester) => semester.courses);
  }
}
