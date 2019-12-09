import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Semester } from '../semester';

@Injectable({
  providedIn: 'root',
})
export class SemesterService {
  semesters: Semester[] = [
    {
      id: 'fa19',
      name: 'Fall 2019',
      courses: [
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
      ],
    },
    {
      id: 'sp20',
      name: 'Spring 2020',
      courses: [
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
      ],
    },
  ];

  constructor() {}

  getSemesters(): Observable<Semester[]> {
    return of(this.semesters);
  }
}
