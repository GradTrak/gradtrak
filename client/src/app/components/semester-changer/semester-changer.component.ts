import { Component, OnInit, Input } from '@angular/core';
import { Semester } from 'models/semester.model'

@Component({
  selector: 'app-semester-changer',
  templateUrl: './semester-changer.component.html',
  styleUrls: ['./semester-changer.component.css']
})
export class SemesterChangerComponent implements OnInit {

  @Input() semesters: Semester[];
  constructor() { }

  ngOnInit() {
  }





}
