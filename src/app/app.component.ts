import { Component } from '@angular/core';
import { Course } from './course'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gradtrak';
  tempCourseList  = {
    11111: {
      id: "cs61a",
      dept: "Computer Science",
      no: "61A",
      title: "structure and interperetation of computer programs",
    },
    11112: {
      id: "cs61b",
      dept: "Computer Science",
      no: "61B",
      title: "Data Structures",
    },
    11113: {
      id: "cs61c",
      dept: "Computer Science",
      no: "61C",
      title: "Datadsf",
    },
  }
}
