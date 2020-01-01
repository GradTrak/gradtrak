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
  public searchPhrase: any;
  allCourses: Course[];
  search = (text$: Observable<string>) => {
    // don't know what the type returned
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.allCourses.filter((v) => v.id.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      )
    );
  };

  constructor(private courseService: CourseService) {}
  updateAutoComplete = (searchText: Observable<string>): any => {
    // any other type and it throws errors?
    function searchFunction(input: string, courseList: Course[]): Course[] {
      const processedInput = input.toLowerCase();
      return courseList.filter((course) => {
        return (
          course.id.toLowerCase().includes(processedInput) ||
          course.title.toLowerCase().includes(processedInput) ||
          course.dept.toLowerCase().includes(processedInput) ||
          course.no.toLowerCase().includes(processedInput)
        );
      });
    }
    return searchText.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      map((searchTerm) => (searchTerm.length < 2 ? [] : searchFunction(searchTerm, this.allCourses)))
    );
  };
  returnCourse(): void {
    if (typeof this.searchPhrase !== 'string') {
      // if it is an object
      this.courseReturned.emit(this.searchPhrase);
    }
  }
  ngOnInit() {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.allCourses = courses;
    });
  }
}
