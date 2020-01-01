import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'models/course.model';
import { Semester } from 'models/semester.model';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css'],
})
export class SemesterComponent implements OnInit {
  @Input() name: string;
  @Input() semester: Semester;
  @ViewChild('courseAdder', {static: false}) courseAdderTemplate: TemplateRef<any>;// what type is the TemplateREf suppoed to be?

  modalInstance: any; // I don't know what type that is
  constructor(public modalService: NgbModal) {}

  ngOnInit(): void {}

  openModal(): void{
    this.modalInstance = this.modalService.open(this.courseAdderTemplate, { size: 'lg' });
  }
  closeModal(): void{
    this.modalInstance.close();
  }
  removeCourse(course: Course): void {
    const courseIndex = this.semester.courses.indexOf(course);
    if (courseIndex > -1) {
      this.semester.courses.splice(courseIndex, 1);
    }
  }
}
