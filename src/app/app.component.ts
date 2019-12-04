import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gradtrak';
  temp_course_dict = {//format: id, {full_name, dept, course_no, display_name, units, requirements, id}
    11111:{
      "full_name":"structure and interperetation of computer programs",
      "dept":"Computer Science",
      "course_no": "61A",
      "display_name":"CS61a",
      "units": 4,
      "requirements": [["req a"],["req b", "req c"]],
      "id": 11111
    },
    11112:{
      "full_name":"data strucutres",
      "dept":"Computer Science",
      "course_no": "61B",
      "display_name":"CS61b",
      "units": 4,
      "requirements": [["req a"],["req c"]],
      "id": 11112
    },
    11113:{
      "full_name":"class 3",
      "dept":"philosophy",
      "course_no":"98BC",
      "display_name":"Phil98BC",
      "units": 1,
      "requirements": [],
      "id": 11113,
    },
  }
}
