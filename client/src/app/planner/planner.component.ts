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

  @ViewChild('login', { static: true }) private loginModalContent: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  @ViewChild('reportFormTemplate', { static: false }) private reportFormTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private loginModalInstance: NgbModalRef;
  private loginPrompted: boolean;

  constructor(private userService: UserService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.userService.queryWhoami();
    this.userService.getState().subscribe((nextState: State) => {
      /* Fetch user data if just logged in */
      if (nextState.loggedIn && !this.state.loggedIn) {
        this.userService.fetchUserData();
      }

      /* Open login modal if not opened previously */
      if (!nextState.loggedIn && !this.loginPrompted) {
        this.loginPrompted = true;
        this.openLogin();
      }

      /* Save user data if logged in and not just loaded */
      if (!nextState.loading && !this.state.loading && nextState.loggedIn) {
        this.userService.saveUserData();
      }

      this.state = nextState;
      this.currentCourses = this.getCurrentCourses();
    });
  }

  openLogin(): void {
    this.loginModalInstance = this.modalService.open(this.loginModalContent);
  }

  closeLogin(): void {
    if (this.loginModalInstance) {
      this.loginModalInstance.close();
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
