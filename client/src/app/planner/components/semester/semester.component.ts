import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from '../../models/course.model';
import { Semester } from '../../models/semester.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.scss'],
})
export class SemesterComponent implements OnInit {
  @Input() readonly semester: Semester;
  @Input() readonly currentSemesters: Semester[]; // Optional
  @Output() openCourseAdder: EventEmitter<void>;

  openCourse: Course;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @ViewChild('courseInfo', { static: true }) readonly courseInfoTemplate: TemplateRef<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  constructor(private modalService: NgbModal, private userService: UserService) {
    this.openCourseAdder = new EventEmitter<void>();
    this.openCourse = null;
  }

  ngOnInit(): void {}

  openCourseInfo(course: Course): void {
    this.openCourse = course;
    this.modalService.open(this.courseInfoTemplate, { size: 'xl' });
  }

  getUnitCount(): number {
    return this.semester.courses.reduce((a: number, b: Course): number => a + b.units, 0);
  }

  isDuplicate(course: Course): boolean {
    return this.getSemestersWithCourse(course).length > 1;
  }

  getSemestersWithCourse(course: Course): Semester[] {
    if (this.currentSemesters) {
      return this.currentSemesters.filter((semester: Semester) => semester.courses.includes(course));
    }
    return [];
  }

  removeCourse(course: Course): void {
    this.userService.removeCourse(course, this.semester);
  }
}
