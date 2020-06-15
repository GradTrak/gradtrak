import { Component, EventEmitter, OnInit, Input, Output, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Semester } from '../../models/semester.model';

@Component({
  selector: 'app-semester-changer',
  templateUrl: './semester-changer.component.html',
  styleUrls: ['./semester-changer.component.scss'],
})
export class SemesterChangerComponent implements OnInit {
  @Input() readonly semestersInput: Map<string, Semester[]>; // optional
  @Output() semesterChanged: EventEmitter<Map<string, Semester[]>>;
  semesters: Map<string, Semester[]>;
  yearNum: number;
  termInput: string;
  errorMessage: string = '';
  private static readonly TERM_INDEX: object = {
    Fall: 0,
    Spring: 1,
    Summer: 2,
  };

  @ViewChild('semesterAdder', { static: false }) private referenceToTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private semesterAdderModal: NgbModalRef;

  constructor(private modalRef: NgbModal) {
    this.semesters = new Map<string, Semester[]>();
    this.semesterChanged = new EventEmitter<Map<string, Semester[]>>();
  }

  ngOnInit(): void {
    if (this.semestersInput) {
      // this creates a deep clone of the map for the arrays
      this.semesters = new Map<string, Semester[]>();
      this.semestersInput.forEach((value, key) => {
        this.semesters.set(key, [...value]);
      });
    }
    this.termInput = 'Fall';
    this.yearNum = 2020; // FIXME make it the current year.
  }

  openSemesterAdder(): void {
    this.semesterAdderModal = this.modalRef.open(this.referenceToTemplate, { size: 'sm' });
  }

  closeSemesterAdder(): void {
    this.semesterAdderModal.close();
  }

  /** Turns a map of semesters into an array of semesters.
   * @return an array of all the semestsers in the values of the map
   */
  getSemArr(mapping: Map<string, Semester[]>): Semester[] {
    return Array.from(this.semesters.keys())
      .sort()
      .map((key) => mapping.get(key))
      .flat()
      .filter((a) => a);
    // consider making this static. Or just having it not take in args?
  }

  /**
   * Given a semester, retunrs the string of its academic year in the form of
   * 'YYYY-YYYY'
   * @param a semester for which you want the year. Name is in 'term YYYY' format.
   */

  getAcademicYearName(semester: Semester): string {
    const semArr = semester.name.split(' ');
    const semesterYear = parseInt(semArr[1], 10) - (semArr[0] !== 'Fall' ? 1 : 0); // this feels so incredibly clunky.
    return `${semesterYear.toString()}-${(semesterYear + 1).toString()}`; // eg '2019-2020'
  }

  /**
   * Adds a semester to the current list of semesters.
   *
   * @param {string} semesterName The intended name of the new semester object being initialized.
   * Must be formatted "term YYYY"
   */
  addSemester(term: string, yearNum: number): void {
    if (!(term && yearNum) || yearNum < 2000 || yearNum > 2050) {
      // console.log(term, yearNum)
      this.errorMessage = 'Please select a term and a valid year.';
      return;
    }
    const semesterName: string = `${term} ${yearNum}`;
    if (this.getSemArr().some((semester: Semester) => semester.name === semesterName)) {
      this.errorMessage = 'This semester is already in your schedule!';
      return;
    }
    const newSemester = new Semester(semesterName);
    const academicYearName = this.getAcademicYearName(newSemester);
    const semArr = semesterName.split(' ');
    const index = SemesterChangerComponent.TERM_INDEX[semArr[0]];
    if (this.semesters.get(academicYearName)) {
      this.semesters.get(academicYearName)[index] = newSemester;
    } else {
      this.semesters.set(academicYearName, [null, null, null]);
      this.semesters.get(academicYearName)[index] = newSemester;
    }
    this.closeSemesterAdder(); // optional. We can decide if this is needed.
  }

  removeSemester(semester: Semester): void {
    const acadYear = this.getAcademicYearName(semester);
    const semesterArr = semester.name.split(' ');
    const index = SemesterChangerComponent.TERM_INDEX[semesterArr[0]];
    this.semesters.get(acadYear)[index] = null;
    // an undo button would be nice here. Or an "are you sure".
    // just in case they delete a semester that's important.
  }

  returnSemesters(): void {
    this.semesterChanged.emit(this.semesters);
  }
}
