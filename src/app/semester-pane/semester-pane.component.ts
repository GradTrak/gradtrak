import { Component, OnInit, Input} from '@angular/core';
import {Semester} from '../semester';
import {Course} from '../course';
import {CourseService} from '../course.service';

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.css']
})
export class SemesterPaneComponent implements OnInit {
  registeredCourses: Course[] = [];
  test = "string";
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
        //this.registeredCourses[0]
        //this doesn't work because it's a class variable and stuff.
      ],
    },
  ];

  constructor(private _courseService : CourseService) {
  };

  ngOnInit() {
    this.registeredCourses = this._courseService.getCourses();
  };

}
