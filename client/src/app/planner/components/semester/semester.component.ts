import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(private userService: UserService) {
    this.openCourseAdder = new EventEmitter<void>();
  }

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

  removeCourse(course: Course): void {
    this.userService.removeCourse(course, this.semester);
  }
}
