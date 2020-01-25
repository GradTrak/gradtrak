/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Semester } from 'models/semester.model';

@Injectable({
  providedIn: 'root',
})
export class SemesterService {
  DUMMY_SEMESTER_DATA: any = {
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

  private sharedSemestersMap: Observable<Map<string, Semester>>;

  constructor() {}

  getSemesters(): Observable<Semester[]> {
    if (!this.sharedSemestersMap) {
      this.fetchSemesterData();
    }
    return this.sharedSemestersMap.pipe(map((data: Map<string, Semester>) => Array.from(data.values())));
  }

  getSemestersMap(): Observable<Map<string, Semester>> {
    return this.sharedSemestersMap;
  }

  private fetchSemesterData(): void {
    this.sharedSemestersMap = of(this.DUMMY_SEMESTER_DATA).pipe(
      map((data: any) => new Map<string, any>(Object.entries(data))),
      map(this.instantiateSemesters),
      shareReplay(),
    );
  }

  private instantiateSemesters(data: Map<string, any>): Map<string, Semester> {
    data.forEach((rawSemester: any, key: string) => {
      data.set(key, new Semester(rawSemester));
    });
    return data;
  }
}
