import { Component, EventEmitter, OnInit, Input, Output, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Semester } from '../../models/semester.model';

@Component({
  selector: 'app-semester-changer',
  templateUrl: './semester-changer.component.html',
  styleUrls: ['./semester-changer.component.scss'],
})
export class SemesterChangerComponent implements OnInit {
  @Input() readonly semestersInput: Semester[]; // optional
  @Output() semesterChanged: EventEmitter<Semester[]>;
  semesters: Semester[];
  yearNum: number;
  seasonInput: string;

  @ViewChild('semesterAdder', { static: false }) private referenceToTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private semesterAdderModal: NgbModalRef;

  constructor(private modalRef: NgbModal) {
    this.semesters = [];
    this.semesterChanged = new EventEmitter<Semester[]>();
  }

  ngOnInit(): void {
    if (this.semestersInput) {
      this.semesters = [...this.semestersInput];
    }
  }

  openSemesterAdder(): void {
    this.semesterAdderModal = this.modalRef.open(this.referenceToTemplate, { size: 'sm' });
  }

  closeSemesterAdder(): void {
    this.semesterAdderModal.close();
  }

  /**
   * Adds a semester to the current list of semesters.
   *
   * @param {string} semesterName The intended name of the new semester object being initialized.
   */
  addSemester(semesterName: string): void {
    if (semesterName.includes('undefined')) {
      return;
    }
    console.log(semesterName);
    if (this.semesters.map(semester => semester.name).includes(semesterName)) {
      return;
    }
    const newSemester = new Semester(semesterName);
    this.semesters.push(newSemester);
    this.semesters.sort(this.semesterCompare);
    this.closeSemesterAdder(); // optional. We can decide if this is needed.
  }
  /**
  * A helper function that is used to compare two semesters, S1, and S2.
  * semesters that are earlier in time will be smaller than semesters
  * that are later in time. Assumes that semesters are named in the format of
  * "Season 20xx" where season is fall, spring, or summer.
  * @return a numerical value representing the diff.
  */
  semesterCompare(sem1: Semester, sem2: Semester) {
    const s1 = sem1.name;
    const s2 = sem2.name;
    if (!(s1.includes(' ') || s2.includes(' '))) {
      console.error('a semester is not properly formatted');
      return 0;
    }
    const calcValue = (sem) => {
      const arr = sem.split(' ');
      if (arr.length != 2) {
        console.log(arr);
        console.error('a semester is not properly formatted');
        return 0; //don't know what else I can do here. Crash the app?
      }
      const seasonVal = ({ //sorry. Just assigning points to each season.
        'Spring' : '0',
        'Summer' : '1',
        'Fall' : '2',
      }[arr[0]]) || '3';
      return (arr[1] + seasonVal) - 0; //sorry nicholas, it's a good meme ok
    }
    return (calcValue(s1) - calcValue(s2));
  }
  removeSemester(semester: Semester): void {
    const index = this.semesters.indexOf(semester);
    this.semesters.splice(index, 1);
    // an undo button would be nice here. Or an "are you sure".
    // just in case they delete a semester that's important.
  }

  returnSemesters(): void {
    this.semesterChanged.emit(this.semesters);
  }
}
