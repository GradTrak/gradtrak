import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from './course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  DUMMY_COURSE_DATA: Course[] = [
    {
      id: 'cs61a',
      dept: 'Computer Science',
      no: '61A',
      title: 'structure and interperetation of computer programs',
      units: 0,
    },
    {
      id: 'cs61b',
      dept: 'Computer Science',
      no: '61B',
      title: 'Data Structures',
      units: 0,
    },
    {
      id: 'sample class c',
      dept: 'Computer Science',
      no: '61C',
      title: 'ANOTHER SAMPLE CLASS, THIS TIME IN ALL CAPS',
      units: 0,
    },
  ];

  constructor() {}
  getCourses(): Observable<Course[]> {
    return of(this.DUMMY_COURSE_DATA);
  }
}
