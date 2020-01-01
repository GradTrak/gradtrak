import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'models/course.model';
import { CourseService } from 'services/course.service';
import { Semester } from 'models/semester.model';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css'],
})
export class SemesterComponent implements OnInit {
  @Input() name: string;
  @Input() semester: Semester;
  @ViewChild('courseAdder', { static: false }) courseAdderTemplate: TemplateRef<any>; // what type is the TemplateREf suppoed to be?
  addableCourses: Course[];

  modalInstance: any; // I don't know what type that is
  constructor(public modalService: NgbModal, private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.addableCourses = courses;
    });
  }
  openModal(): void {
    this.modalInstance = this.modalService.open(this.courseAdderTemplate, { size: 'lg' });
  }
  closeModal(): void {
    this.modalInstance.close();
  }
  addCourse(course: Course): void {
    if (!this.semester.courses.includes(course)) {
      this.semester.courses.push(course);
    }
  }
  removeCourse(course: Course): void {
    const courseIndex = this.semester.courses.indexOf(course);
    if (courseIndex > -1) {
      this.semester.courses.splice(courseIndex, 1);
    }
  }
}
