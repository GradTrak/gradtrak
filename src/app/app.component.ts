import { Component } from '@angular/core';
import { Course } from './course'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gradtrak';
  tempCourseList  = [
    {
      id: "cs61a",
      dept: "Computer Science",
      no: "61A",
      title: "structure and interperetation of computer programs",
      units: 0,
    },
    {
      id: "cs61b",
      dept: "Computer Science",
      no: "61B",
      title: "Data Structures",
      units: 0,
    },
    {
      id: "cs61c",
      dept: "Computer Science",
      no: "61C",
      title: "Datadsf",
      units: 0,
    },
  ]
}
