import { Injectable } from '@angular/core';
import {CourseService} from '../course.service';
import {Course} from '../course'
import {Semester} from '../semester';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {
  registeredCourses: Course[] = [];
  constructor(private _courseService: CourseService) { }
  getSemesters(): Semester[]{
    this.registeredCourses = this._courseService.getCourses();
    return [ {
        id: "fa19",
        name: "Fall 2019",
        courses: [
          this.registeredCourses[0],
          this.registeredCourses[1],
      ],
    },
      {
        id: "sp20",
        name: "Spring 2020",
        courses: [
          this.registeredCourses[2],
          this.registeredCourses[2],
          this.registeredCourses[2],
          this.registeredCourses[2],
          this.registeredCourses[2],
          this.registeredCourses[2],
          this.registeredCourses[2],
          this.registeredCourses[2],
          this.registeredCourses[2],
          this.registeredCourses[2],
          this.registeredCourses[2],
          this.registeredCourses[2],
          
        ],
      },
    ];
  }
}
