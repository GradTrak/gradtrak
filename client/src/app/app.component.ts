import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'models/course.model';
import { RequirementSet } from 'models/requirement-set.model';
import { Semester } from 'models/semester.model';
import { State } from 'models/state.model';
import { UserService } from 'services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  semesters: Semester[];
  baseGoals: RequirementSet[];

  @ViewChild('login', { static: true }) private loginModalContent: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private loginModalInstance: NgbModalRef;

  constructor(private userService: UserService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.userService.fetchUserData();
    this.userService.getState().subscribe((state: State) => {
      this.semesters = state.userData.semesters;
      this.baseGoals = state.userData.goals;

      if (state.loggedIn) {
        this.userService.saveUserData();
      }
    });
  }

  getCurrentCourses(): Course[] {
    return this.semesters.flatMap((semester: Semester) => semester.courses);
  }

  openLogin(): void {
    this.loginModalInstance = this.modalService.open(this.loginModalContent, { size: 'sm' });
  }

  closeLogin(): void {
    if (this.loginModalInstance) {
      this.loginModalInstance.close();
    }
  }
}
