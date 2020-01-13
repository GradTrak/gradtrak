import { Component } from '@angular/core';
import { Course } from 'models/course.model';
import { Semester } from 'models/semester.model';
import { SemesterService } from 'services/semester.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'gradtrak';

  semesters: Semester[];

  constructor(private semesterService: SemesterService) {}

  ngOnInit(): void {
    this.semesterService
      .getSemesters() // Returns an Observable
      .subscribe((semesters) => {
        this.semesters = semesters;
      });
  }

  getCurrentCourses(): Course[] {
    return this.semesters.flatMap((semester) => semester.courses);
  }

  setSemesters(semesters: Semester[]): void {
    this.semesters = semesters;
  }
}
