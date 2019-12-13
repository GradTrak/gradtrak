import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Semester } from 'models/semester.model';

@Injectable({
  providedIn: 'root',
})
export class SemesterService {
  semesters: Semester[] = [
    {
      id: 'fa2019',
      name: 'Fall 2019',
      courses: [],
    },
    {
      id: 'sp2020',
      name: 'Spring 2020',
      courses: [],
    },
    {
      id: 'fa20',
      name: 'Fall 2020',
      courses: [],
    },
    {
      id: 'sp2021',
      name: 'Spring 2021',
      courses: [],
    },
    {
      id: 'fa21',
      name: 'Fall 2021',
      courses: [],
    },
    {
      id: 'sp2022',
      name: 'Spring 2022',
      courses: [],
    },
    {
      id: 'fa22',
      name: 'Fall 2022',
      courses: [],
    },
    {
      id: 'sp2023',
      name: 'Spring 2023',
      courses: [],
    },
  ];

  constructor() {}

  getSemesters(): Observable<Semester[]> {
    return of(this.semesters);
  }
}
