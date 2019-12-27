import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Course } from 'models/course.model';
import { CourseService } from 'services/course.service';

@Component({
  selector: 'app-course-searcher',
  templateUrl: './course-searcher.component.html',
  styleUrls: ['./course-searcher.component.css']
})
export class CourseSearcherComponent implements OnInit {
  @Output() courseSelected: EventEmitter<Course> = new EventEmitter<Course>();
  searchPhrase: FormControl = new FormControl();
  allCourses: Course[];
  courseMatches: Course[];
  constructor(private courseService: CourseService) { }
  updateAutoComplete():void{
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
    this.courseMatches = searchFunction(this.searchPhrase.value, this.allCourses)
  }
  returnCourse(): void{
    this.courseSelected.emit(this.courseMatches[0])
  }
  ngOnInit() {
    this.courseService.getCourses().subscribe((courses: Course[])=>{
      this.allCourses = courses;
      this.courseMatches = courses;
    })
  }


}
