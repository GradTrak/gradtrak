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

  updateAutoComplete = (searchText: Observable<string>): Observable<Course[]> => {
    return searchText.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      map((searchTerm: string) => searchTerm.toLowerCase()),
      map((searchTerm: string) => {
        if (searchTerm.length < 2) {
          return [];
        }
        return this.allCourses.filter(
          (course: Course) =>
            course.id.toLowerCase().includes(searchTerm) ||
            course.title.toLowerCase().includes(searchTerm) ||
            course.dept.toLowerCase().includes(searchTerm) ||
            course.no.toLowerCase().includes(searchTerm)
        );
      })
    );
  };

  returnCourse(): void {
    if (this.searchedCourse instanceof Course) {
      this.courseReturned.emit(this.searchedCourse);
    }
  }
}
