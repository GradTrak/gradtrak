import { Component } from '@angular/core';
import { Course } from 'models/course.model';
import { Semester } from 'models/semester.model';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gradtrak';

  semesters: Semester[];

  constructor(private semesterService: UserService ) {}

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
}
