import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'models/course.model';
import { Semester } from 'models/semester.model';
import { CourseService } from 'services/course.service';
import { UserService } from 'services/user.service';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.scss'],
})
export class SemesterComponent implements OnInit {
  @Input() readonly semester: Semester;
  @Input() readonly currentSemesters: Semester[]; // Optional

  @ViewChild('courseAdder', { static: false }) private courseAdderTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private modalInstance: NgbModalRef;

  constructor(private modalService: NgbModal, private courseService: CourseService, private userService: UserService) {}

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
    this.userService.addCourse(course, this.semester);
  }

  removeCourse(course: Course): void {
    this.userService.removeCourse(course, this.semester);
  }
}
