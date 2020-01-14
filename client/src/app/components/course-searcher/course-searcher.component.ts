import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Course } from 'models/course.model';
import { CourseService } from 'services/course.service';

@Component({
  selector: 'app-course-searcher',
  templateUrl: './course-searcher.component.html',
  styleUrls: ['./course-searcher.component.css'],
})
export class CourseSearcherComponent implements OnInit {
  @Output() courseReturned: EventEmitter<Course> = new EventEmitter<Course>();
  searchedCourse: Course;
  allCourses: Course[];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.allCourses = courses;
    });
  }

  searchFunction(input: string, courseList: Course[]): Course[] {
    const processedInput = input.toLowerCase().replace(/[^\w]/g, '');
    return courseList.filter((course) =>
      course
        .toString()
        .toLowerCase()
        .replace(/[^\w]/g, '')
        .includes(processedInput),
    );
  }

  /**
   * Given a string observable, return all courses that match the specification of searchFunction in the form of an
   * Observable.
   *
   * @param {Observable<string>} searchText An observable containing the text that the user has inputted.
   */
  updateAutoComplete = (searchText: Observable<string>): Observable<Course[]> => {
    return searchText.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      map((searchTerm) => (searchTerm.length < 2 ? [] : this.searchFunction(searchTerm, this.allCourses))),
      map((results: Course[]) => results.slice(0, 8)),
      // TODO: sort this by search rankings for relevance
    );
  };

  returnCourse(): void {
    if (this.searchedCourse instanceof Course) {
      this.courseReturned.emit(this.searchedCourse);
    }
  }
}
