import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, shareReplay } from 'rxjs/operators';
import { Course } from 'models/course.model';
import { TagService } from 'services/tag.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private static readonly COURSE_API_ENDPOINT = '/api/courses';

  private sharedCoursesObj: Observable<object>;

  constructor(private tagService: TagService, private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    if (!this.sharedCoursesObj) {
      this.fetchCourseData();
    }
    return this.sharedCoursesObj.pipe(map(Object.values));
  }

  getCoursesObj(): Observable<object> {
    if (!this.sharedCoursesObj) {
      this.fetchCourseData();
    }
    return this.sharedCoursesObj;
  }

  private fetchCourseData(): void {
    this.sharedCoursesObj = this.http.get(CourseService.COURSE_API_ENDPOINT).pipe(
      flatMap((data: object) => this.linkTags(data)),
      map(this.instantiateCourses),
      shareReplay(),
    );
  }

  private linkTags(data: object): Observable<object> {
    return this.tagService.getTagsObj().pipe(
      map((tagsObj: object) => {
        Object.values(data).forEach((rawCourse) => {
          rawCourse.tags = rawCourse.tagIds.map((tagId: string) => {
            const tag = tagsObj[tagId];
            if (!tag) {
              console.error(`No Tag object found for tag ID: ${tagId}`);
            }
            return tag;
          });
          delete rawCourse.tagIds;
          return rawCourse;
        });
        return data;
      }),
    );
  }

  private instantiateCourses(data: object): object {
    Object.keys(data).forEach((key: string) => {
      data[key] = new Course(data[key]);
    });
    return data;
  }
}
