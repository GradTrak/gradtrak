import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Course } from 'models/course.model';
import { CourseService } from 'services/course.service';

@Component({
  selector: 'app-course-searcher',
  templateUrl: './course-searcher.component.html',
  styleUrls: ['./course-searcher.component.css']
})
export class CourseSearcherComponent implements OnInit {
  searchPhrase: FormControl = new FormControl();
  courseMatches: Course[]; //uses courseIDs so that the courseID is displayed
  //in the text box, not [object, object]
  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.courseService.getCourses().subscribe((courses: Course[])=>{
      this.courseMatches = courses
    })
  }


}
