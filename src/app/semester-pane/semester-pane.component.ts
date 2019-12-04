import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.css']
})
export class SemesterPaneComponent implements OnInit {
  temp_semester_list = {//format: "season year": {num_classes, list_classes}
    "Fall 2019": [11111, 11112, 11113]
  }
  @Input() registered_courses;

  constructor() { }

  ngOnInit() {
  }

}
