/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, shareReplay } from 'rxjs/operators';
import { Course } from 'models/course.model';
import { Tag } from 'models/tag.model';
import { TagService } from 'services/tag.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private static readonly COURSE_API_ENDPOINT = '/api/courses';

  private sharedCoursesMap: Observable<Map<string, Course>>;

  constructor(private tagService: TagService, private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    if (!this.sharedCoursesMap) {
      this.fetchCourseData();
    }
    return this.sharedCoursesMap.pipe(map((data: Map<string, Course>) => Array.from(data.values())));
  }

  getCoursesMap(): Observable<Map<string, Course>> {
    if (!this.sharedCoursesMap) {
      this.fetchCourseData();
    }
    return this.sharedCoursesMap;
  }

  /**
   * Takes in data, map linkTags to it, and turns all objects in the data into an instance of the Course class.
   */
  private fetchCourseData(): void {
    this.sharedCoursesMap = this.http.get(CourseService.COURSE_API_ENDPOINT).pipe(
      map((data: any) => new Map<string, any>(Object.entries(data))),
      flatMap((data: Map<string, any>) => this.linkTags(data)),
      map(this.instantiateCourses),
      shareReplay(),
    );
  }

  /**
   * Replaces all the IDs of the data with references to their appropriate objects.
   *
   * @param {Map<string, any>} data A mapping of IDs to their respective objects.
   * @return {Observable<Map<string, any>>} An Observable with a map of IDs to their respective courses.
   */
  private linkTags(data: Map<string, any>): Observable<Map<string, any>> {
    return this.tagService.getTagsMap().pipe(
      map((tagsMap: Map<string, Tag>) => {
        data.forEach((rawCourse) => {
          rawCourse.tags = rawCourse.tagIds.map((tagId: string) => {
            const tag = tagsMap.get(tagId);
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

  private instantiateCourses(data: Map<string, any>): Map<string, Course> {
    data.forEach((rawCourse: any, key: string) => {
      data.set(key, new Course(rawCourse));
    });
    return data;
  }
}
