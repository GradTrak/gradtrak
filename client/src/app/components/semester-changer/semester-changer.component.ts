import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { Semester } from 'models/semester.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-semester-changer',
  templateUrl: './semester-changer.component.html',
  styleUrls: ['./semester-changer.component.css'],
})
export class SemesterChangerComponent implements OnInit {
  @Input() semesters: Semester[];
  @ViewChild('semesterAdder', { static: false }) referenceToTemplate: TemplateRef<any>;
  semesterName: string;
  semesterAdderModal: NgbModalRef;

  test;
  constructor(private modalRef: NgbModal) {}

  ngOnInit() {}

  openSemesterAdder(): void {
    this.semesterAdderModal = this.modalRef.open(this.referenceToTemplate, { size: 'sm' });
  }

  closeSemesterAdder(): void {
    this.semesterAdderModal.close();
  }

  addSemester(semesterName: string): void {
    const newSemester = new Semester({
      id: 'something', // TODO: figure out the ID of semesters being added
      name: semesterName,
      courses: [],
    });
    this.test = typeof this.semesters;
    this.semesters.push(newSemester);
    this.closeSemesterAdder(); // optional. We can decide if this is needed.
  }
  removeSemester(semester: Semester): void {
    const index = this.semesters.indexOf(semester);
    this.semesters.splice(index, 1);
    // an undo button would be nice here. Or an "are you sure".
    // just in case they delete a semester that's important.
  }
}
