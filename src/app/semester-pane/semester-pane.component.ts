import { Component, OnInit, Input} from '@angular/core';
import {Semester} from '../semester'
import {Course} from '../course'

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.css']
})
export class SemesterPaneComponent implements OnInit {
  @Input() registeredCourses;
  semesterList: Semester[] = [ {
      id: "1",
      name: "Fall 2019",
      courses: [],
    },
    {
    id: "2",
    name: "Spring 2020",
    courses: [],
    },
  ]
  //TODO: if importing takes up extra space, it may be worth just using export
  // instead to find the relevant classes so that we don't store copies

  constructor() { }

  ngOnInit() {
  }

}
