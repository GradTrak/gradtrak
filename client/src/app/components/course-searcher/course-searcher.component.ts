import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { Course } from 'models/course.model';
import { CourseService } from 'services/course.service';

@Component({
  selector: 'app-course-searcher',
  templateUrl: './course-searcher.component.html',
  styleUrls: ['./course-searcher.component.css']
})
export class CourseSearcherComponent implements OnInit {
  @Output() courseReturned: EventEmitter<Course> = new EventEmitter<Course>();
  public model: any; //figure out what model means
  allCourses: Course[];
  courseMatches: Course[];

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.allCourses.filter(v => v.id.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )}

  constructor(private courseService: CourseService) { }
  updateAutoComplete = (searchText: Observable<string>):any =>{ //any other type and it throws errors?
    function searchFunction(input: string, courseList: Course[]): Course[] {
      let processedInput = input.toLowerCase();
      return courseList.filter((course)=>{
        return (
          course.id.toLowerCase().includes(processedInput) ||
          course.title.toLowerCase().includes(processedInput) ||
          course.dept.toLowerCase().includes(processedInput) ||
          course.no.toLowerCase().includes(processedInput))
      })
    }
    return (searchText.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(searchTerm=>searchTerm.length < 2? [] :
        searchFunction(searchTerm, this.allCourses)),
      map(courseList=>courseList.map((course)=>course.id))
      ));
//      return this.courseMatches.map((course: Course)=>(course.dept + ' ' + course.no));

  }
  returnCourse(): void{
    const selectedCourse: Course = this.allCourses.filter((course)=>{
      return course.id === this.model;
    })[0]
    if (selectedCourse){this.courseReturned.emit(selectedCourse)}
  }
  ngOnInit() {
    this.courseService.getCourses().subscribe((courses: Course[])=>{
      this.allCourses = courses;
      this.courseMatches = courses;
    })
  }


}
