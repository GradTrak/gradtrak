import { Component, Input, OnInit } from '@angular/core';
import { SemesterService } from '../semester-pane/semester.service';
import { CourseService } from '../course.service';
import { Course } from '../course';
import { Semester } from '../semester';

@Component({
  selector: 'app-course-adder',
  templateUrl: './course-adder.component.html',
  styleUrls: ['./course-adder.component.css'],
})
export class CourseAdderComponent implements OnInit {
  addableCourses: Course[];
  selectedCourse: Course;
  @Input() semester: Semester;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      console.log(courses);
      this.addableCourses = courses;
    });
  }
  addCourse(course: Course): void {
    this.semester.courses.push(course);
  }
}
