import { Component } from '@angular/core';
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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.fetchUserData();
    this.userService.getState().subscribe((state: State) => {
      this.semesters = state.userData.semesters;
      this.baseGoals = state.userData.goals;

      this.userService.saveUserData();
    });
  }

  getCurrentCourses(): Course[] {
    return this.semesters.flatMap((semester: Semester) => semester.courses);
  }
}
