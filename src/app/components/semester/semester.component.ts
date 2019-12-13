import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Semester } from 'models/semester.model';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css'],
})
export class SemesterComponent implements OnInit {
  @Input() name: string;
  @Input() semester: Semester;

  constructor(public modalService: NgbModal) {}

  ngOnInit(): void {}

  removeCourse(course: Course): void {
    const courseIndex = this.semester.courses.indexOf(course);
    if (courseIndex > -1) {
      this.semester.courses.splice(courseIndex, 1);
    }
  }
}
