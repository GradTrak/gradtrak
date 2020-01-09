import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Semester } from 'models/semester.model';
import { SemesterService } from 'services/semester.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.css'],
})
export class SemesterPaneComponent implements OnInit {
  // TODO: if importing takes up extra space, it may be worth just using export
  // instead to find the relevant classes so that we don't store copies

  private semesterChangerModalReference: NgbModalRef;
  @ViewChild('semesterChangerTemplate', { static: false }) semesterChangerTemplate: TemplateRef<any>;
  @Input() semesters: Semester[];

  constructor(private semesterService: SemesterService, private modalService: NgbModal) {}

  ngOnInit() {}

  openSemesterChanger(): void {
    this.semesterChangerModalReference = this.modalService.open(this.semesterChangerTemplate, { size: 'lg' });
    // don't know what type this is
  }
  closeSemesterChanger(): void {
    this.semesterChangerModalReference.close();
  }
  setSemesters(semestersOutput: Semester[]): void {
    this.semesters = semestersOutput;
  }
}
