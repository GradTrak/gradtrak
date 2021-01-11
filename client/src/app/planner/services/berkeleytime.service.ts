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
  private static readonly GRADE_API_ENDPOINT = '/api/grades/grades_json/';

  private sharedGradesMap: Observable<Map<string, Course>>;

  constructor(private http: HttpClient) {}

  getGrades(course: Course): String {
    
    return 'no.'
  }
}
