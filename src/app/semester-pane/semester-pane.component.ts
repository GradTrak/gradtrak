import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.css']
})
export class SemesterPaneComponent implements OnInit {
  temp_semester_list = {//format: "season year": {num_classes, list_classes}
    "Fall 2019": {
      num_classes: 3, list_classes: [11111, 11112, 11113]
    }
  }
  temp_class_dict = {//format: id, {long_text_name, long_class_dept_numer, display_name, units, requirements_filled}
    11111:{
      "long_text_name":"structure and interperetation of computer programs",
      "class_dept_nmr":"computer science 61a",
      "displayname":"CS61a",
      "units": 4,
      "requirements": ["list of requirements"]
    },
    11112:{
      "long_text_name":"Data strucutres",
      "class_dept_nmr":"computer science 61b",
      "displayname":"CS61b",
      "units": 4,
      "requirements": ["list of requirements"]
    },
    11113:{
      "long_text_name":"class 3",
      "class_dept_nmr":"class 3",
      "displayname":"C3",
      "units": 2,
      "requirements": ["requirement 1"]
    },
  }

  constructor() { }

  ngOnInit() {
  }

}
