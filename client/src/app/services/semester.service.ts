import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Semester } from 'models/semester.model';

@Injectable({
  providedIn: 'root',
})
export class SemesterService {
  DUMMY_SEMESTER_DATA: object = {
    fa2019: {
      id: 'fa2019',
      name: 'Fall 2019',
      courses: [],
    },
    sp2020: {
      id: 'sp2020',
      name: 'Spring 2020',
      courses: [],
    },
    fa20: {
      id: 'fa20',
      name: 'Fall 2020',
      courses: [],
    },
    sp2021: {
      id: 'sp2021',
      name: 'Spring 2021',
      courses: [],
    },
    fa21: {
      id: 'fa21',
      name: 'Fall 2021',
      courses: [],
    },
    sp2022: {
      id: 'sp2022',
      name: 'Spring 2022',
      courses: [],
    },
    fa22: {
      id: 'fa22',
      name: 'Fall 2022',
      courses: [],
    },
    sp2023: {
      id: 'sp2023',
      name: 'Spring 2023',
      courses: [],
    },
  };

  private sharedSemestersObj: Observable<object>;

  constructor() {}

  getSemesters(): Observable<Semester[]> {
    if (!this.sharedSemestersObj) {
      this.fetchSemesterData();
    }
    return this.sharedSemestersObj.pipe(map(Object.values));
  }

  getSemestersObj(): Observable<object> {
    return this.sharedSemestersObj;
  }

  private fetchSemesterData(): void {
    this.sharedSemestersObj = of(this.DUMMY_SEMESTER_DATA).pipe(map(this.instantiateSemesters), shareReplay());
  }

  private instantiateSemesters(data: object): object {
    Object.keys(data).forEach((key: string) => {
      data[key] = new Semester(data[key]);
    });
    return data;
  }
}
