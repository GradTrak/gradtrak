import { Component, Input, OnInit } from '@angular/core';
import { Semester } from 'models/semester.model';
import { SemesterService } from 'services/semester.service';

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.css'],
})
export class SemesterPaneComponent implements OnInit {
  @Input() semesters: Semester[];

  constructor(private semesterService: SemesterService) {}

  ngOnInit(): void {}
}
