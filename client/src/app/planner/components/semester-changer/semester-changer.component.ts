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
  seasonInput: string;
  errorMessage: string = '';
  semesterArr: Semester[];
  SEASON_INDEX: object = {
    'Fall' : 0,
    'Spring' : 1,
    'Summer' : 2
  };


  @ViewChild('semesterAdder', { static: false }) private referenceToTemplate: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private semesterAdderModal: NgbModalRef;

  constructor(private modalRef: NgbModal) {
    this.semesters = new Map<string, Semester[]>();
    this.semesterChanged = new EventEmitter<Map<string, Semester[]>>();
  }

  ngOnInit(): void {
    if (this.semestersInput) {
      this.semesters = new Map<string, Semester[]>();
      console.log(this.semestersInput);
      this.semestersInput.forEach((value, key) => {
        console.log('value should be', value);
        console.log('key should be', key);
        this.semesters.set(key, [...value]);
      });
    }
    this.semesterArr = Array.from(this.semesters.values()).flat().filter(a => a);
  }

  openSemesterAdder(): void {
    this.semesterAdderModal = this.modalRef.open(this.referenceToTemplate, { size: 'sm' });
  }

  closeSemesterAdder(): void {
    this.semesterAdderModal.close();
  }



  /**
  * Given a semester, retunrs the string of its academic year in the form of
  * 'YYYY-YYYY'
  * @param a semester for which you want the year. Name is in 'Season YYYY' format.
  */

  getAcademicYearName(semester: Semester) {
    const semArr = semester.name.split(' ')
    const semesterYear = parseInt(semArr[1]) - ((semArr[0] !== 'Fall')? 1 : 0); //this feels so incredibly clunky.
    return semesterYear.toString() + "-" + (semesterYear+1).toString(); //eg '2019-2020'
  }

  /**
   * Adds a semester to the current list of semesters.
   *
   * @param {string} semesterName The intended name of the new semester object being initialized.
   * Must be formatted "Season YYYY"
   */
  addSemester(semesterName: string): void {
    if (semesterName.includes('undefined')) {
      this.errorMessage = 'Please select a season and a valid year.';
      return;
    }
    if (Array.from(this.semesters.values()).flat().map((semester) => semester?semester.name:null).includes(semesterName)) {
      this.errorMessage = 'This semester is already in your schedule!';
      return;
    }
    const newSemester = new Semester(semesterName);
    const academicYearName = this.getAcademicYearName(newSemester);
    const semArr = semesterName.split(' ');
    const index = this.SEASON_INDEX[semArr[0]];
    if (this.semesters[academicYearName]) {
      this.semesters.get(academicYearName)[index] = newSemester;
    } else {
      this.semesters.set(academicYearName, [null, null, null]);
      this.semesters.get(academicYearName)[index] = newSemester;
    }
    this.closeSemesterAdder(); // optional. We can decide if this is needed.
  }

  /**
   * A helper function that is used to compare two semesters, S1, and S2.
   * semesters that are earlier in time will be smaller than semesters
   * that are later in time. Assumes that semesters are named in the format of
   * "Season 20xx" where season is fall, spring, or summer.
   * @return a numerical value representing the diff.
   */
  semesterCompare(sem1: Semester, sem2: Semester): number {
    const s1 = sem1.name;
    const s2 = sem2.name;
    if (!(s1.includes(' ') || s2.includes(' '))) {
      console.error('a semester is not properly formatted');
      return 0;
    }
    const calcValue = (sem): number => {
      const arr = sem.split(' ');
      if (arr.length !== 2) {
        console.error('a semester is not properly formatted');
        return 0; // don't know what else I can do here. Crash the app?
      }
      const seasonVal =
        {
          // sorry. Just assigning points to each season.
          Spring: '0',
          Summer: '1',
          Fall: '2',
        }[arr[0]] || '3';
      return arr[1] + seasonVal - 0; // sorry nicholas, it's a good meme ok
    };
    return calcValue(s1) - calcValue(s2);
  }

  removeSemester(semester: Semester): void {
    const acadYear = this.getAcademicYearName(semester);
    const semesterArr = semester.name.split(' ');
    const index = this.SEASON_INDEX[semesterArr[0]];
    this.semesters[acadYear][index] = null;
    // an undo button would be nice here. Or an "are you sure".
    // just in case they delete a semester that's important.
  }

  returnSemesters(): void {
    this.semesterChanged.emit(this.semesters);
  }
}
