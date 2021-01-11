import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, shareReplay } from 'rxjs/operators';
import { CoursePrototype } from 'common/prototypes/course.prototype';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class BerkeleytimeService {
  private static readonly GRADE_API_ENDPOINT = 'https://berkeleytime.com/api/grades/grades_json/';

  private sharedGradesMap: Observable<Map<string, Course>>;

  constructor(private http: HttpClient) {

  }

  getGrades(course: Course): Observable<Object> {
    return this.http.get(BerkeleytimeService.GRADE_API_ENDPOINT);
  }
}
