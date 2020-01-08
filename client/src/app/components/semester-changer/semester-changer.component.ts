import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { Semester } from 'models/semester.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-semester-changer',
  templateUrl: './semester-changer.component.html',
  styleUrls: ['./semester-changer.component.css'],
})
export class SemesterChangerComponent implements OnInit {
  @Input() semesters: Semester[];
  @ViewChild('modalinsidemodal', { static: false }) referenceToTemplate: TemplateRef<any>;
  semesterName: string;

  test;
  constructor(private modalRef: NgbModal) {}

  ngOnInit() {}

  openModal() {
    this.modalRef.open(this.referenceToTemplate, { size: 'sm' });
  }

  addSemester(semesterName: string): void {
    const newSemester = new Semester({
      id: 'something', // TODO: figure out the ID of semesters being added
      name: semesterName,
      courses: [],
    });
    this.test = typeof this.semesters;
    this.semesters.push(newSemester);
  }
  removeSemester(semester: Semester): void {
    const index = this.semesters.indexOf(semester);
    this.semesters.splice(index, 1);
  }
}
