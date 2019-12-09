import { Component, OnInit } from '@angular/core';
import { Semester } from '../semester';
import { SemesterService } from './semester.service';

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.css'],
})
export class SemesterPaneComponent implements OnInit {
  // TODO: if importing takes up extra space, it may be worth just using export
  // instead to find the relevant classes so that we don't store copies

  semesters: Semester[];

  semesterAddingTo: Semester;

  constructor(private semesterService: SemesterService) {}

  ngOnInit(): void {
    this.semesterService
      .getSemesters() // Returns an Observable
      .subscribe((semesters) => {
        this.semesters = semesters;
      });
  }
}
