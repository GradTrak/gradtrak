import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-course-searcher',
  templateUrl: './course-searcher.component.html',
  styleUrls: ['./course-searcher.component.css']
})
export class CourseSearcherComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = ['61a', '61b', '70'];
  constructor() { }

  ngOnInit() {
  }


}
