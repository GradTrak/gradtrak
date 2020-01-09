import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'models/course.model';
import { CourseService } from 'services/course.service';
import { Semester } from 'models/semester.model';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css'],
})
export class SemesterComponent implements OnInit {
  @Input() semester: Semester;
  @Input() currentSemesters: Semester[]; // Optional

  @ViewChild('courseAdder', { static: false }) private courseAdderTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private modalInstance: NgbModalRef;

  constructor(private modalService: NgbModal, private courseService: CourseService) {}

  ngOnInit(): void {}

  isDuplicate(course: Course): boolean {
    return this.getSemestersWithCourse(course).length > 1;
  }

  getSemestersWithCourse(course: Course): Semester[] {
    if (this.currentSemesters) {
      return this.currentSemesters.filter((semester: Semester) => semester.courses.includes(course));
    }
    return [];
  }

  openAdder(): void {
    this.modalInstance = this.modalService.open(this.courseAdderTemplate, { size: 'lg' });
  }

  closeAdder(): void {
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
