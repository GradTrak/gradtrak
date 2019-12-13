import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'models/course.model';
import { Semester } from 'models/semester.model';
import { CourseService } from 'services/course.service';

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

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.addableCourses = courses;
    });
  }

  addCourse(course: Course): void {
    if (!this.semester.courses.includes(course)) {
      this.semester.courses.push(course);
    }
  }
}
