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
  @ViewChild('login', { static: true }) private loginModalContent: TemplateRef<any>;
  @ViewChild('reportFormTemplate', { static: false }) private reportFormTemplate: TemplateRef<any>;
  @ViewChild('accountEditor', { static: true }) private accountEditorContent: TemplateRef<any>;
  private loginModalInstance: NgbModalRef;
  private loginPrompted: boolean;
  private accountEditorInstance: NgbModalRef;
  /* eslint-enable @typescript-eslint/no-explicit-any */

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
      }
      this.state = nextState;
      this.currentCourses = this.getCurrentCourses();
    });
    this.userService.queryWhoami().subscribe();
  }

  openLogin(): void {
    this.loginModalInstance = this.modalService.open(this.loginModalContent);
  }

  onSignUp(): void {}

  closeLogin(): void {
    if (this.loginModalInstance) {
      this.loginModalInstance.close();
    }
  }

  openAccountEditor(): void {
    this.accountEditorInstance = this.modalService.open(this.accountEditorContent);
  }

  closeAccountEditor(): void {
    if (this.accountEditorInstance) {
      this.accountEditorInstance.close();
    }
  }

  showReportForm(): void {
    this.modalService.open(this.reportFormTemplate);
  }

  logout(): void {
    this.userService.logout();
  }

  private getCurrentCourses(): Course[] {
    return this.state.userData.semesters.flatMap((semester: Semester) => semester.courses);
  }
}
