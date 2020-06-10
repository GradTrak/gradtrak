import { Component, Input, OnInit, OnChanges, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Semester } from '../../models/semester.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.scss'],
})
export class SemesterPaneComponent implements OnInit, OnChanges {
  @Input() readonly semesters: Map<string, Semester[]>;
  semesterArr: Semester[];

  @ViewChild('semesterChangerTemplate', { static: false }) private semesterChangerTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private semesterChangerModalReference: NgbModalRef;

  constructor(private modalService: NgbModal, private userService: UserService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
  }

  openSemesterChanger(): void {
    this.semesterChangerModalReference = this.modalService.open(this.semesterChangerTemplate, { size: 'lg' });
  }

  closeSemesterChanger(): void {
    this.semesterChangerModalReference.close();
  }

  setSemesters(semestersOutput: Map<string, Semester[]>): void {
    this.userService.updateSemesters(semestersOutput);
  }

  /** Identical to the semesterchanger :(
  * Turns a map of semesters into an array of semesters.
   * @param mapping a mapping of the academic year to their corresponding semesters
   * @return an array of all the semestsers in the values of the map
   */
  getSemArr(mapping: Map<string, Semester[]>): Semester[] {
    return Array.from(mapping.values())
      .flat()
      .filter((a) => a);
    // a temporary fix because we haven't implemented view by year functionality yet.
  }
}
