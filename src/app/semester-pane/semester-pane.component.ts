import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-semester-pane',
  templateUrl: './semester-pane.component.html',
  styleUrls: ['./semester-pane.component.css']
})
export class SemesterPaneComponent implements OnInit {
  temp_semester_list = {//format: "season year": {num_classes, list_classes}
    "Fall 2019": [11111, 11112, 11113],
    "Spring 2020" : [11112, 11113,11113]
  }
  @Input() registered_courses;
  //TODO: if importing takes up extra space, it may be worth just using export
  // instead to find the relevant classes so that we don't store copies

  constructor() { }

  ngOnInit() {
  }

}
