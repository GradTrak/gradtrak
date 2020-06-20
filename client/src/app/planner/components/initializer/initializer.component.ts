import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RequirementSet } from '../../models/requirement-set.model';
import { Semester } from '../../models/semester.model';
import { UserData } from '../../models/user-data.model';

@Component({
  selector: 'app-initializer',
  templateUrl: './initializer.component.html',
  styleUrls: ['./initializer.component.scss'],
})
export class InitializerComponent implements OnInit {
  @Output() initializeData: EventEmitter<UserData>;
  startYear: number;
  gradYear: number;
  summer: boolean;
  semesterError: string;
  state: 'semesters' | 'goals';

  constructor() {
    this.initializeData = new EventEmitter<UserData>();
    this.state = 'semesters';
  }

  ngOnInit(): void {}

  next(): void {
    if (!this.startYear || !this.gradYear) {
      this.semesterError = 'Please fill in all required fields.';
      return;
    }
    if (this.startYear >= this.gradYear) {
      this.semesterError = 'The start year must be before the year of graduation.';
      return;
    }
    this.state = 'goals';
  }

  submit(reqSets: RequirementSet[]): void {
    const semesters: Map<string, Semester[]> = this.initializeSemesters(this.startYear, this.gradYear, this.summer);
    this.initializeData.emit(new UserData(semesters, reqSets));
  }

  initializeSemesters(startYear: number, gradYear: number, summer: boolean): Map<string, Semester[]> {
    const semesters: Map<string, Semester[]> = new Map<string, Semester[]>();
    for (let i: number = startYear; i < gradYear; i += 1) {
      const currSem: Semester[] = [];
      currSem.push(new Semester(`Fall ${i}`));
      currSem.push(new Semester(`Spring ${i + 1}`));
      if (summer) {
        currSem.push(new Semester(`Summer ${i + 1}`));
      }
      semesters.set(`${i}-${i + 1}`, currSem);
    }
    return semesters;
  }
}
