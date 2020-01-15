import { Component } from '@angular/core';
import { Course } from 'models/course.model';
import { Semester } from 'models/semester.model';
import { UserService } from './services/user.service';
import { RequirementSet } from './models/requirement-set.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gradtrak';
  baseGoals: RequirementSet[];
  semesters: Semester[];

  constructor(private semesterService: UserService ) {}

  ngOnInit(): void {
    this.semesterService
      .getSemesters() // Returns an Observable
      .subscribe((semesters) => {
        this.semesters = semesters;
      });
    this.baseGoals = []
  }

  getCurrentCourses(): Course[] {
    return this.semesters.flatMap((semester) => semester.courses);
  }

  setBaseGoals(baseGoals: RequirementSet[]): void {
    this.baseGoals = baseGoals;
  }
}
