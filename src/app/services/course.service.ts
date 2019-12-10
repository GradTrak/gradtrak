import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from 'models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  DUMMY_COURSE_DATA: Course[] = [
    {
      id: 'cs61a',
      dept: 'CS',
      no: '61A',
      title: 'Structure and Interperetation of Computer Programs',
      units: 4,
    },
    {
      id: 'cs61b',
      dept: 'CS',
      no: '61B',
      title: 'Data Structures',
      units: 4,
    },
    {
      id: 'cs61c',
      dept: 'CS',
      no: '61C',
      title: 'Great Ideas of Computer Architecture',
      units: 4,
    },
    {
      id: 'cs70',
      dept: 'CS',
      no: '70',
      title: 'Discrete Mathematics and Probability Theory',
      units: 4,
    },
    {
      id: 'eecs16a',
      dept: 'EECS',
      no: '16A',
      title: 'Designing Information Devices and Systems I',
      units: 4,
    },
    {
      id: 'eecs16b',
      dept: 'EECS',
      no: '16B',
      title: 'Designing Information Devices and Systems II',
      units: 4,
    },
  ];

  constructor() {}

  getCourses(): Observable<Course[]> {
    return of(this.DUMMY_COURSE_DATA);
  }
}
