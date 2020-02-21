import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, shareReplay } from 'rxjs/operators';
import { CoursePrototype } from 'common/prototypes/course.prototype';
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
      // Instantiate courses
      flatMap((data: CoursePrototype[]) =>
        this.tagService
          .getTagsMap()
          .pipe(
            map((tagsMap: Map<string, Tag>) =>
              data.map((courseProto: CoursePrototype) => new Course(courseProto, tagsMap)),
            ),
          ),
      ),
      // Create Map
      map((data: Course[]) => {
        const coursesMap = new Map<string, Course>();
        data.forEach((course: Course) => coursesMap.set(course.id, course));
        return coursesMap;
      }),
      shareReplay(),
    );
  }
}
