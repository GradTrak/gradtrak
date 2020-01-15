import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Semester } from 'models/semester.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'services/user.service';

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.scss'],
})
export class SemesterPaneComponent implements OnInit {
  // TODO: if importing takes up extra space, it may be worth just using export
  // instead to find the relevant classes so that we don't store copies

  private semesterChangerModalReference: NgbModalRef;
  @ViewChild('semesterChangerTemplate', { static: false }) private semesterChangerTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Input() semesters: Semester[];

  constructor(private modalService: NgbModal, private userService: UserService) {}

  ngOnInit(): void {}

  openSemesterChanger(): void {
    this.semesterChangerModalReference = this.modalService.open(this.semesterChangerTemplate, { size: 'lg' });
  }

  closeSemesterChanger(): void {
    this.semesterChangerModalReference.close();
  }

  setSemesters(semestersOutput: Semester[]): void {
    this.semesters = semestersOutput;
    this.userService.saveSemesters(this.semesters);
  }
}
