import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, map, shareReplay } from 'rxjs/operators';
import { CoursePrototype } from 'common/prototypes/course.prototype';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})

/**
 * A service which queries the berkeleytiem API for 
 * information about average letter grades, and about 
 * course enrollment history.
 */
export class BerkeleytimeService {
  // private static readonly GRADE_API_ENDPOINT = 'https://berkeleytime.com/api/grades/grades_json/';
  private static readonly GRADE_API_ENDPOINT = '/api/grades/';

  /* A function that returns an observable that gives the grade of a class */
  getGrade(course: Course): Observable<string> {
    const subject = new BehaviorSubject<string>('B-');
    return subject;
    // return this.http.get(BerkeleytimeService.GRADE_API_ENDPOINT + `?course_id=${course.berkeleyTimeId}`);
  }

  /* A function that returns an observable that gives the semesters a class was offered */
  getSemesters(course: Course): Observable<string[]> {
    const subject = new BehaviorSubject<string[]>(['haiyaaaa', 'Fall 2019', 'Spring 2019']);
    return subject;
    // return this.http.get(BerkeleytimeService.GRADE_API_ENDPOINT + `?course_id=${course.berkeleyTimeId}`);
  }
}
