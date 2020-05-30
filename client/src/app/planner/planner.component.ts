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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @ViewChild('login', { static: true }) private loginModalContent: TemplateRef<any>;
  @ViewChild('reportFormTemplate', { static: false }) private reportFormTemplate: TemplateRef<any>;
  @ViewChild('accountEditor', { static: true }) private accountEditorContent: TemplateRef<any>;
  private loginModalInstance: NgbModalRef;
  private accountEditorInstance: NgbModalRef;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  constructor(private userService: UserService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.userService.queryWhoami();
    this.userService.getState().subscribe((state: State) => {
      /* Fetch user data if just logged in */
      if (state.loggedIn && !this.state.loggedIn) {
        this.userService.fetchUserData();
      }

      /* Save user data if logged in and not just loaded */
      if (!state.loading && !this.state.loading && state.loggedIn) {
        this.userService.saveUserData();
      }

      this.state = state;
      this.currentCourses = this.getCurrentCourses();
    });
  }

  openLogin(): void {
    this.loginModalInstance = this.modalService.open(this.loginModalContent, { size: 'sm' });
  }

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
