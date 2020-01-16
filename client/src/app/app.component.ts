import { Component } from '@angular/core';
import { Course } from 'models/course.model';
import { RequirementSet } from 'models/requirement-set.model';
import { Semester } from 'models/semester.model';
import { UserData } from 'models/user-data.model';
import { UserService } from 'services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gradtrak';
  baseGoals: RequirementSet[];
  semesters: Semester[];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserData().subscribe((userData: UserData) => {
      console.log(userData);
      this.semesters = userData.semesters;
      this.baseGoals = userData.goals;
    });
    this.baseGoals = [];
  }

  getCurrentCourses(): Course[] {
    return this.semesters.flatMap((semester: Semester) => semester.courses);
  }

  setBaseGoals(baseGoals: RequirementSet[]): void {
    this.baseGoals = baseGoals;
    this.saveState();
  }

  setSemesters(semesters: Semester[]): void {
    this.semesters = semesters;
    this.saveState();
  }

  saveState(): void {
    this.userService.saveUserData(this.semesters, this.baseGoals);
  }
}
