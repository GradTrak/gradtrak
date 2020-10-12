import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Semester } from '../../models/semester.model';

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.scss'],
})
export class SemesterPaneComponent implements OnInit {
  @Input() readonly semesters: Map<string, Semester[]>;
  @Output() openSemesterChanger: EventEmitter<void>;
  @Output() openCourseAdder: EventEmitter<Semester>;
  semesterArr: Semester[];

  constructor() {
    this.openSemesterChanger = new EventEmitter<void>();
    this.openCourseAdder = new EventEmitter<Semester>();
  }

  ngOnInit(): void {}

  getYears(): Semester[][] {
    return Array.from(this.semesters.values());
  }

  /** Identical to the semesterchanger :(
   * Turns a map of semesters into an array of semesters.
   * @param mapping a mapping of the academic year to their corresponding semesters
   * @return an array of all the semestsers in the values of the map
   */
  getSemArr(mapping: Map<string, Semester[]>): Semester[] {
    return Array.from(mapping.keys())
      .sort()
      .map((key) => mapping.get(key))
      .flat()
      .filter((a) => a);
    // a temporary fix because we haven't implemented view by year functionality yet.
  }
}
