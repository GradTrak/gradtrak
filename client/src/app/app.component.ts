import { Component } from '@angular/core';
import { Course } from 'models/course.model';
import { RequirementSet } from 'models/requirement-set.model';
import { Semester } from 'models/semester.model';
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
    this.userService.getUserData().subscribe((userData: any) => {
      console.log(userData);
      // FIXME Create interface for user data
      this.semesters = userData.semesters;
      this.baseGoals = userData.goals;
    });
    this.baseGoals = [];//shouldn't this come before teh subscription?
  }

  getCurrentCourses(): Course[] {
    return this.semesters.flatMap((semester) => semester.courses);
  }

  setBaseGoals(baseGoals: RequirementSet[]): void {
    this.baseGoals = baseGoals;
    this.saveState();
  }
  setSemesters(semesters: Semester[]): void { //these are kind of parallel so maybe consider a naming convention that works for both? eg setBaseSemesters or setGoals.
    this.semesters = semesters;
    this.saveState();
  }
  saveState(): void{
    this.userService.saveUserData(this.semesters, this.baseGoals);
  }
}
