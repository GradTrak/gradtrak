import { Component, OnInit, Input} from '@angular/core';
import {Semester} from '../semester'
import {Course} from '../course'

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.css']
})
export class SemesterPaneComponent implements OnInit {
  @Input() registeredCourses: Course[];
  //TODO: if importing takes up extra space, it may be worth just using export
  // instead to find the relevant classes so that we don't store copies

  semesterList: Semester[] = [ {
      id: "fa19",
      name: "Fall 2019",
      courses: [
        {id : "cs61a",
        dept : "CS",
        no: "61a",
        title: "str int cmp pgrms",
        units: 4
      },
      {id : "cs61b",
      dept : "CS",
      no: "61b",
      title: "Data structures",
      units: 4
      }
    ],
  },
    {
      id: "sp20",
      name: "Spring 2020",
      courses: [
        //registeredCourses[1]
        //this doesn't work because it's not found for some reason? the html works though when interpolation
      ],
    },
  ]

  constructor() {
  }

  ngOnInit() {
  }

}
