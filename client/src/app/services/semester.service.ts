import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Semester } from 'models/semester.model';

@Injectable({
  providedIn: 'root',
})
export class SemesterService {
  private static readonly SEMESTER_API_ENDPOINT = '/api/semesters';

  private sharedSemestersObj: Observable<object>;

  constructor(private http: HttpClient) {}

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
    this.sharedSemestersObj = this.http
      .get(SemesterService.SEMESTER_API_ENDPOINT)
      .pipe(map(this.instantiateSemesters), shareReplay());
  }

  private instantiateSemesters(data: object): object {
    Object.keys(data).forEach((key: string) => {
      data[key] = new Semester(data[key]);
    });
    return data;
  }
}
