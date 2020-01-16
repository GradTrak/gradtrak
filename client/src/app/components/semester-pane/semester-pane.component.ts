import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef } from '@angular/core';
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
  @Output() semestersChanged: EventEmitter<Semester[]>;
  @Output() stateChanged: EventEmitter<any>; // a generic catch-all to update the user ingo

  constructor(private modalService: NgbModal, private userService: UserService) {
    this.semestersChanged = new EventEmitter<Semester[]>();
    this.stateChanged = new EventEmitter<any>();
  }

  ngOnInit(): void {}

  openSemesterChanger(): void {
    this.semesterChangerModalReference = this.modalService.open(this.semesterChangerTemplate, { size: 'lg' });
  }

  closeSemesterChanger(): void {
    this.semesterChangerModalReference.close();
  }

  setSemesters(semestersOutput: Semester[]): void {
    this.semestersChanged.emit(semestersOutput);
    // this.userService.saveSemesters(this.semesters);
  }
  emitChange(): void {
    this.stateChanged.emit(); // again if there was a way to bubble it it would be better
  }
}
